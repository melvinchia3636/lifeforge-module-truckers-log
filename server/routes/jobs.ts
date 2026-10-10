import { and, countDistinct, desc, eq, gte, inArray, lte } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-orm/zod'
import z from 'zod'

import forge from '../forge'
import { ets2RecordJobs, ets2RecordSamples } from '../schema.drizzle'
import { computeJobStats } from '../utils/jobStats'

const DEFAULT_PER_PAGE = 20

const jobStatsShape = {
  sample_count: z.number(),
  distance_km: z.number().nullable(),
  max_speed_kmh: z.number().nullable(),
  avg_speed_kmh: z.number().nullable(),
  fuel_used_l: z.number(),
  adblue_used_l: z.number(),
  idle_min: z.number()
}

const jobDto = createSelectSchema(ets2RecordJobs).extend(jobStatsShape)

type JobRow = typeof ets2RecordJobs.$inferSelect

type SampleRow = typeof ets2RecordSamples.$inferSelect

function windowSamples(
  job: JobRow,
  samplesBySession: Map<string, SampleRow[]>
): SampleRow[] {
  if (!job.session_id) return []

  const start = job.started_at.getTime()

  const end = job.finished_at?.getTime() ?? Date.now()

  return (samplesBySession.get(job.session_id) ?? []).filter(
    sample => sample.t_ms >= start && sample.t_ms <= end
  )
}

export const list = forge
  .query({
    description: 'List recorded jobs with optional filters.',
    input: {
      query: z.object({
        sessionId: z.string().optional(),
        game: z.enum(['ets2', 'ats', 'unknown']).optional(),
        status: z
          .enum(['active', 'delivered', 'cancelled', 'interrupted'])
          .optional(),
        from: z.string().optional(),
        to: z.string().optional(),
        page: z.string().optional(),
        perPage: z.string().optional()
      })
    },
    output: {
      OK: z.object({
        items: z.array(jobDto),
        page: z.number(),
        perPage: z.number(),
        totalItems: z.number(),
        totalPages: z.number()
      })
    }
  })
  .callback(async ({ db, query, response }) => {
    const filters = [
      ...(query.sessionId
        ? [eq(ets2RecordJobs.session_id, query.sessionId)]
        : []),
      ...(query.game ? [eq(ets2RecordJobs.game, query.game)] : []),
      ...(query.status ? [eq(ets2RecordJobs.status, query.status)] : []),
      ...(query.from
        ? [gte(ets2RecordJobs.started_at, new Date(query.from))]
        : []),
      ...(query.to ? [lte(ets2RecordJobs.started_at, new Date(query.to))] : [])
    ]

    const where = filters.length > 0 ? and(...filters) : undefined

    const parsedPage = parseInt(query.page ?? '1', 10) || 1

    const parsedPerPage =
      parseInt(query.perPage ?? String(DEFAULT_PER_PAGE), 10) ||
      DEFAULT_PER_PAGE

    const [countRow] = await db
      .select({ value: countDistinct(ets2RecordJobs.id) })
      .from(ets2RecordJobs)
      .where(where)

    const totalItems = Number(countRow?.value ?? 0)

    const totalPages = Math.max(1, Math.ceil(totalItems / parsedPerPage))

    const rows = await db
      .select()
      .from(ets2RecordJobs)
      .where(where)
      .orderBy(desc(ets2RecordJobs.started_at))
      .limit(parsedPerPage)
      .offset((parsedPage - 1) * parsedPerPage)

    const sessionIds = [
      ...new Set(
        rows
          .map(row => row.session_id)
          .filter((id): id is string => id !== null)
      )
    ]

    const sampleRows =
      sessionIds.length > 0
        ? await db
            .select()
            .from(ets2RecordSamples)
            .where(inArray(ets2RecordSamples.session_id, sessionIds))
            .orderBy(ets2RecordSamples.t_ms)
        : []

    const samplesBySession = new Map<string, SampleRow[]>()

    for (const sample of sampleRows) {
      const bucket = samplesBySession.get(sample.session_id) ?? []

      bucket.push(sample)

      samplesBySession.set(sample.session_id, bucket)
    }

    return response.ok({
      items: rows.map(job => ({
        ...job,
        ...computeJobStats(windowSamples(job, samplesBySession))
      })),
      page: parsedPage,
      perPage: parsedPerPage,
      totalItems,
      totalPages
    })
  })

export const get = forge
  .query({
    description: 'Get a single recorded job by id.',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), ets2RecordJobs)
      })
    },
    output: {
      OK: jobDto
    }
  })
  .callback(async ({ db, query: { id }, response }) => {
    const job = await db.query.jobs.findFirst({ where: { id } })

    if (!job) {
      return response.notFound()
    }

    const samples = job.session_id
      ? await db
          .select()
          .from(ets2RecordSamples)
          .where(eq(ets2RecordSamples.session_id, job.session_id))
          .orderBy(ets2RecordSamples.t_ms)
      : []

    const start = job.started_at.getTime()

    const end = job.finished_at?.getTime() ?? Date.now()

    const window = samples.filter(
      sample => sample.t_ms >= start && sample.t_ms <= end
    )

    return response.ok({ ...job, ...computeJobStats(window) })
  })
