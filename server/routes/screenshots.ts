import { promises as fs } from 'node:fs'
import { and, countDistinct, desc, eq, gte, lte } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-orm/zod'
import z from 'zod'

import { fileReferenceSchema } from '@lifeforge/file-storage'

import forge from '../forge'
import {
  ets2RecordJobs,
  ets2RecordScreenshots,
  ets2RecordSessions
} from '../schema.drizzle'
import { imageSize } from '../utils/imageSize'
import { fromEts2CoordsToWgs84 } from '../utils/projection'
import { tokenMatches } from '../utils/token'

const DEFAULT_PER_PAGE = 24

const gameSchema = z.enum(['ets2', 'ats', 'unknown'])

const screenshotDto = createSelectSchema(ets2RecordScreenshots).extend({
  lon: z.number().nullable(),
  lat: z.number().nullable(),
  file: fileReferenceSchema.nullable()
})

type ScreenshotRow = typeof ets2RecordScreenshots.$inferSelect

/** Metadata the recording agent sends alongside the image. */
const metadataSchema = z.object({
  filename: z.string(),
  capturedAt: z.number(),
  game: gameSchema.optional(),
  gameMin: z.number().nullable().optional(),
  x: z.number().nullable().optional(),
  y: z.number().nullable().optional(),
  z: z.number().nullable().optional(),
  headingDeg: z.number().nullable().optional(),
  speedKmh: z.number().nullable().optional(),
  truckId: z.string().optional(),
  truckName: z.string().optional(),
  truckBrand: z.string().optional(),
  truckPlate: z.string().optional(),
  contentHash: z.string().optional()
})

function coordsOf(
  row: Pick<ScreenshotRow, 'x' | 'z'>
): { lon: number; lat: number } | null {
  if (row.x == null || row.z == null) return null

  const [lon, lat] = fromEts2CoordsToWgs84([row.x, row.z])

  return { lon, lat }
}

/** Reads just the image header from the staged temp file. */
async function readHeader(path: string, bytes = 65536): Promise<Buffer | null> {
  try {
    const handle = await fs.open(path, 'r')

    try {
      const buffer = Buffer.alloc(bytes)
      const { bytesRead } = await handle.read(buffer, 0, bytes, 0)

      return buffer.subarray(0, bytesRead)
    } finally {
      await handle.close()
    }
  } catch {
    return null
  }
}

export const upload = forge
  .mutation({
    description:
      'Upload an in-game screenshot with its telemetry metadata, recorded by the agent.',
    noAuth: true,
    encrypted: false,
    rateLimit: false,
    input: {
      body: z.object({
        token: z.string(),
        clientId: z.string(),
        metadata: z.string()
      })
    },
    media: {
      file: { optional: false }
    },
    output: {
      OK: z.object({
        id: z.string(),
        file: fileReferenceSchema.nullable(),
        duplicate: z.boolean()
      })
    }
  })
  .callback(async ({ db, core, body, media, response }) => {
    const settings = await db.query.settings.findFirst()

    if (!settings || !tokenMatches(body.token, settings.ingest_token_hash)) {
      return response.unauthorized()
    }

    let metadata: z.infer<typeof metadataSchema>

    try {
      metadata = metadataSchema.parse(JSON.parse(body.metadata))
    } catch {
      return response.badRequest('Invalid screenshot metadata')
    }

    const file = media.file

    if (!file || typeof file === 'string') {
      return response.badRequest('A screenshot image must be uploaded')
    }

    if (!file.mimeType.startsWith('image/')) {
      return response.badRequest('Only image uploads are accepted')
    }

    const findExisting = async (contentHash: string) => {
      const row = await db.query.screenshots.findFirst({
        where: { client_id: body.clientId, content_hash: contentHash }
      })

      if (!row) return null

      const existingFile = row.file_key
        ? await core.storage.getReference(row.file_key)
        : null

      return { id: row.id, file: existingFile, duplicate: true }
    }

    // Dedupe by content hash so re-uploads (retries, backfill) are idempotent.
    if (metadata.contentHash) {
      const existing = await findExisting(metadata.contentHash)

      if (existing) {
        return response.ok(existing)
      }
    }

    const header = await readHeader(file.path)
    const size = header ? imageSize(header) : null

    const ref = await core.storage.save({
      file,
      thumbs: ['400x0', '1600x0']
    })

    if (!ref) {
      return response.badRequest('Failed to store the screenshot')
    }

    const capturedAt = new Date(metadata.capturedAt)

    // Attach to the session/job that was active when the shot was taken.
    const [session] = await db
      .select()
      .from(ets2RecordSessions)
      .where(
        and(
          eq(ets2RecordSessions.client_id, body.clientId),
          lte(ets2RecordSessions.started_at, capturedAt)
        )
      )
      .orderBy(desc(ets2RecordSessions.started_at))
      .limit(1)

    let sessionId: string | null = null
    let jobId: string | null = null

    if (session && (!session.finished_at || session.finished_at >= capturedAt)) {
      sessionId = session.id

      const [job] = await db
        .select()
        .from(ets2RecordJobs)
        .where(
          and(
            eq(ets2RecordJobs.session_id, session.id),
            lte(ets2RecordJobs.started_at, capturedAt)
          )
        )
        .orderBy(desc(ets2RecordJobs.started_at))
        .limit(1)

      if (job && (!job.finished_at || job.finished_at >= capturedAt)) {
        jobId = job.id
      }
    }

    try {
      const [row] = await db
        .insert(ets2RecordScreenshots)
        .values({
          session_id: sessionId,
          job_id: jobId,
          client_id: body.clientId,
          game: metadata.game ?? 'unknown',
          captured_at: capturedAt,
          game_min: metadata.gameMin ?? null,
          x: metadata.x ?? null,
          y: metadata.y ?? null,
          z: metadata.z ?? null,
          heading_deg: metadata.headingDeg ?? null,
          speed_kmh: metadata.speedKmh ?? null,
          truck_id: metadata.truckId ?? '',
          truck_name: metadata.truckName ?? '',
          truck_brand: metadata.truckBrand ?? '',
          truck_plate: metadata.truckPlate ?? '',
          filename: metadata.filename,
          mime: ref.mimeType,
          size_bytes: ref.size,
          width: size?.width ?? null,
          height: size?.height ?? null,
          file_key: ref.key,
          content_hash: metadata.contentHash ?? null
        })
        .returning()

      if (!row) {
        await core.storage.delete(ref.key)

        return response.badRequest('Failed to record the screenshot')
      }

      return response.ok({ id: row.id, file: ref, duplicate: false })
    } catch (error) {
      // A concurrent upload of the same content won the race: keep its row.
      await core.storage.delete(ref.key)

      const existing = metadata.contentHash
        ? await findExisting(metadata.contentHash)
        : null

      if (existing) {
        return response.ok(existing)
      }

      throw error
    }
  })

export const list = forge
  .query({
    description: 'List recorded screenshots with optional filters.',
    input: {
      query: z.object({
        jobId: z.string().optional(),
        sessionId: z.string().optional(),
        game: gameSchema.optional(),
        from: z.string().optional(),
        to: z.string().optional(),
        page: z.string().optional(),
        perPage: z.string().optional()
      })
    },
    output: {
      OK: z.object({
        items: z.array(screenshotDto),
        page: z.number(),
        perPage: z.number(),
        totalItems: z.number(),
        totalPages: z.number()
      })
    }
  })
  .callback(async ({ db, core, query, response }) => {
    const filters = [
      ...(query.jobId ? [eq(ets2RecordScreenshots.job_id, query.jobId)] : []),
      ...(query.sessionId
        ? [eq(ets2RecordScreenshots.session_id, query.sessionId)]
        : []),
      ...(query.game ? [eq(ets2RecordScreenshots.game, query.game)] : []),
      ...(query.from
        ? [gte(ets2RecordScreenshots.captured_at, new Date(query.from))]
        : []),
      ...(query.to
        ? [lte(ets2RecordScreenshots.captured_at, new Date(query.to))]
        : [])
    ]

    const where = filters.length > 0 ? and(...filters) : undefined

    const parsedPage = parseInt(query.page ?? '1', 10) || 1

    const parsedPerPage =
      parseInt(query.perPage ?? String(DEFAULT_PER_PAGE), 10) ||
      DEFAULT_PER_PAGE

    const [countRow] = await db
      .select({ value: countDistinct(ets2RecordScreenshots.id) })
      .from(ets2RecordScreenshots)
      .where(where)

    const totalItems = Number(countRow?.value ?? 0)

    const totalPages = Math.max(1, Math.ceil(totalItems / parsedPerPage))

    const rows = await db
      .select()
      .from(ets2RecordScreenshots)
      .where(where)
      .orderBy(desc(ets2RecordScreenshots.captured_at))
      .limit(parsedPerPage)
      .offset((parsedPage - 1) * parsedPerPage)

    const files = await Promise.all(
      rows.map(row =>
        row.file_key ? core.storage.getReference(row.file_key) : null
      )
    )

    return response.ok({
      items: rows.map((row, index) => {
        const coords = coordsOf(row)

        return {
          ...row,
          lon: coords?.lon ?? null,
          lat: coords?.lat ?? null,
          file: files[index] ?? null
        }
      }),
      page: parsedPage,
      perPage: parsedPerPage,
      totalItems,
      totalPages
    })
  })

export const get = forge
  .query({
    description: 'Get a single recorded screenshot by id.',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), ets2RecordScreenshots)
      })
    },
    output: {
      OK: screenshotDto
    }
  })
  .callback(async ({ db, core, query: { id }, response }) => {
    const row = await db.query.screenshots.findFirst({ where: { id } })

    if (!row) {
      return response.notFound()
    }

    const file = row.file_key
      ? await core.storage.getReference(row.file_key)
      : null

    const coords = coordsOf(row)

    return response.ok({
      ...row,
      lon: coords?.lon ?? null,
      lat: coords?.lat ?? null,
      file
    })
  })

export const remove = forge
  .mutation({
    description: 'Delete a recorded screenshot and its stored image.',
    input: {
      body: z.object({
        id: forge.existsIn(z.string(), ets2RecordScreenshots)
      })
    },
    output: {
      NO_CONTENT: true
    }
  })
  .callback(async ({ db, core, body: { id }, response }) => {
    const row = await db.query.screenshots.findFirst({ where: { id } })

    if (!row) {
      return response.notFound()
    }

    if (row.file_key) {
      await core.storage.delete(row.file_key)
    }

    await db.delete(ets2RecordScreenshots).where(eq(ets2RecordScreenshots.id, id))

    return response.noContent()
  })
