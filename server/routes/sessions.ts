import { and, asc, desc, eq, gte, inArray, lte } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-orm/zod'
import z from 'zod'

import forge from '../forge'
import {
  ets2RecordEvents,
  ets2RecordSamples,
  ets2RecordSessions
} from '../schema.drizzle'
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

/**
 * A jump faster than this many game-units per second is treated as a teleport
 * (e.g. quick jobs relocate the truck to the pickup). Normal driving is well
 * under this (the map is scaled), so it reliably separates teleports from
 * driving without depending on the projection's scale.
 */
const TELEPORT_UNITS_PER_SEC = 250

/** Segments this small are stationary clusters (e.g. the pre-teleport moment). */
const MIN_SEGMENT_UNITS = 100

function segmentExtent(points: { u: [number, number] }[]): number {
  let minX = Infinity
  let minZ = Infinity
  let maxX = -Infinity
  let maxZ = -Infinity

  for (const { u } of points) {
    minX = Math.min(minX, u[0])
    maxX = Math.max(maxX, u[0])
    minZ = Math.min(minZ, u[1])
    maxZ = Math.max(maxZ, u[1])
  }

  return Math.hypot(maxX - minX, maxZ - minZ)
}

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
        z: ets2RecordSamples.z,
        t_ms: ets2RecordSamples.t_ms,
        game_min: ets2RecordSamples.game_min
      })
      .from(ets2RecordSamples)
      .where(and(...filters))
      .orderBy(asc(ets2RecordSamples.t_ms))

    // Ferry/train crossings also move the truck discontinuously; keep those
    // jumps connected instead of treating them as teleports.
    const ferryEvents = await db
      .select({ game_min: ets2RecordEvents.game_min })
      .from(ets2RecordEvents)
      .where(
        and(
          eq(ets2RecordEvents.session_id, query.sessionId),
          inArray(ets2RecordEvents.kind, ['ferry', 'train'])
        )
      )

    const ferryGameMins = ferryEvents.map(event => event.game_min)

    const step = Math.max(1, Math.ceil(rows.length / MAX_ROUTE_POINTS))

    const points: {
      coord: [number, number]
      u: [number, number]
      t: number
      g: number
    }[] = []

    for (let i = 0; i < rows.length; i += step) {
      const sample = rows[i]

      if (!sample || (sample.x === 0 && sample.z === 0)) continue

      const [lon, lat] = fromEts2CoordsToWgs84([sample.x, sample.z])

      points.push({
        coord: [Number(lon.toFixed(5)), Number(lat.toFixed(5))],
        u: [sample.x, sample.z],
        t: sample.t_ms,
        g: sample.game_min
      })
    }

    // Split into segments at teleports so quick-job jumps don't draw a straight
    // line across the map. Ferry/train crossings are split out as their own
    // `transit` segments (drawn dashed) instead of being skipped.
    const segments: (typeof points)[] = []

    const transits: [number, number][][] = []

    let current: typeof points = []

    for (let i = 0; i < points.length; i++) {
      const point = points[i]

      if (!point) continue

      const prev = points[i - 1]

      if (prev) {
        const seconds = (point.t - prev.t) / 1000

        const unitsPerSec =
          seconds > 0
            ? Math.hypot(point.u[0] - prev.u[0], point.u[1] - prev.u[1]) /
              seconds
            : Infinity

        if (unitsPerSec > TELEPORT_UNITS_PER_SEC) {
          const crossedByFerry =
            prev.g > 0 &&
            point.g > 0 &&
            ferryGameMins.some(g => g >= prev.g && g <= point.g)

          if (current.length >= 2) segments.push(current)

          if (crossedByFerry) transits.push([prev.coord, point.coord])

          current = []
        }
      }

      current.push(point)
    }

    if (current.length >= 2) segments.push(current)

    // Drop stationary clusters (e.g. the moment before a quick-job teleport).
    const kept = segments.filter(
      segment => segmentExtent(segment) >= MIN_SEGMENT_UNITS
    )

    const first = kept[0]?.[0]

    const last = kept[kept.length - 1]?.at(-1)

    const features: z.infer<typeof featureDto>[] = [
      ...kept.map(segment => ({
        type: 'Feature' as const,
        properties: { kind: 'session' },
        geometry: {
          type: 'LineString',
          coordinates: segment.map(point => point.coord)
        }
      })),
      ...transits.map(coordinates => ({
        type: 'Feature' as const,
        properties: { kind: 'transit' },
        geometry: { type: 'LineString', coordinates }
      })),
      ...(first
        ? [
            {
              type: 'Feature' as const,
              properties: { color: '#22c55e' },
              geometry: { type: 'Point', coordinates: first.coord }
            }
          ]
        : []),
      ...(last && last !== first
        ? [
            {
              type: 'Feature' as const,
              properties: { color: '#ef4444' },
              geometry: { type: 'Point', coordinates: last.coord }
            }
          ]
        : [])
    ]

    return response.ok({ type: 'FeatureCollection' as const, features })
  })
