import { and, asc, desc, eq, gte, lte } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-orm/zod'
import z from 'zod'

import forge from '../forge'
import { ets2RecordSamples, ets2RecordSessions } from '../schema.drizzle'
import { fromEts2CoordsToWgs84 } from '../utils/projection'

const sessionDto = createSelectSchema(ets2RecordSessions)

const featureDto = z.object({
  type: z.literal('Feature'),
  properties: z.record(z.string(), z.unknown()),
  geometry: z.object({
    type: z.string(),
    coordinates: z.unknown()
  })
})

const routeDto = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(featureDto)
})

const MAX_ROUTE_POINTS = 1500

export const list = forge
  .query({
    description: 'List recorded sessions with optional filters.',
    input: {
      query: z.object({
        game: z.enum(['ets2', 'ats', 'unknown']).optional(),
        status: z
          .enum(['active', 'completed', 'interrupted'])
          .optional(),
        from: z.string().optional(),
        to: z.string().optional()
      })
    },
    output: {
      OK: z.array(sessionDto)
    }
  })
  .callback(async ({ db, query, response }) => {
    const filters = [
      ...(query.game ? [eq(ets2RecordSessions.game, query.game)] : []),
      ...(query.status ? [eq(ets2RecordSessions.status, query.status)] : []),
      ...(query.from
        ? [gte(ets2RecordSessions.started_at, new Date(query.from))]
        : []),
      ...(query.to
        ? [lte(ets2RecordSessions.started_at, new Date(query.to))]
        : [])
    ]

    const rows = await db
      .select()
      .from(ets2RecordSessions)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(desc(ets2RecordSessions.started_at))

    return response.ok(rows)
  })

export const get = forge
  .query({
    description: 'Get a single recorded session by id.',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), ets2RecordSessions)
      })
    },
    output: {
      OK: sessionDto
    }
  })
  .callback(async ({ db, query: { id }, response }) => {
    const session = await db.query.sessions.findFirst({ where: { id } })

    if (!session) {
      return response.notFound()
    }

    return response.ok(session)
  })

export const route = forge
  .query({
    description: 'Get the recorded route of a session as GeoJSON.',
    input: {
      query: z.object({
        sessionId: forge.existsIn(z.string(), ets2RecordSessions),
        from: z.string().optional(),
        to: z.string().optional()
      })
    },
    output: {
      OK: routeDto
    }
  })
  .callback(async ({ db, query, response }) => {
    const filters = [
      eq(ets2RecordSamples.session_id, query.sessionId),
      ...(query.from
        ? [gte(ets2RecordSamples.t_ms, new Date(query.from).getTime())]
        : []),
      ...(query.to
        ? [lte(ets2RecordSamples.t_ms, new Date(query.to).getTime())]
        : [])
    ]

    const rows = await db
      .select({
        x: ets2RecordSamples.x,
        z: ets2RecordSamples.z
      })
      .from(ets2RecordSamples)
      .where(and(...filters))
      .orderBy(asc(ets2RecordSamples.t_ms))

    const step = Math.max(1, Math.ceil(rows.length / MAX_ROUTE_POINTS))

    const coordinates: [number, number][] = []

    for (let i = 0; i < rows.length; i += step) {
      const sample = rows[i]

      if (!sample || (sample.x === 0 && sample.z === 0)) continue

      const [lon, lat] = fromEts2CoordsToWgs84([sample.x, sample.z])

      coordinates.push([Number(lon.toFixed(5)), Number(lat.toFixed(5))])
    }

    const first = coordinates[0]

    const last = coordinates[coordinates.length - 1]

    const features: z.infer<typeof featureDto>[] = [
      {
        type: 'Feature',
        properties: { kind: 'session' },
        geometry: { type: 'LineString', coordinates }
      },
      ...(first
        ? [
            {
              type: 'Feature' as const,
              properties: { color: '#22c55e' },
              geometry: { type: 'Point', coordinates: first }
            }
          ]
        : []),
      ...(last && last !== first
        ? [
            {
              type: 'Feature' as const,
              properties: { color: '#ef4444' },
              geometry: { type: 'Point', coordinates: last }
            }
          ]
        : [])
    ]

    return response.ok({ type: 'FeatureCollection' as const, features })
  })
