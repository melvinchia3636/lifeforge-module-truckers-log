import { and, asc, eq, isNotNull, sql } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-orm/zod'
import z from 'zod'

import forge from '../forge'
import { ets2RecordEvents, ets2RecordSamples } from '../schema.drizzle'

const eventDto = createSelectSchema(ets2RecordEvents).extend({
  x: z.number().nullable(),
  z: z.number().nullable()
})

export const list = forge
  .query({
    description: 'List recorded game events with optional filters.',
    input: {
      query: z.object({
        sessionId: z.string().optional(),
        jobId: z.string().optional(),
        kind: z
          .enum(['fine', 'refuel', 'tollgate', 'ferry', 'train'])
          .optional()
      })
    },
    output: {
      OK: z.array(eventDto)
    }
  })
  .callback(async ({ db, query, response }) => {
    const filters = [
      ...(query.sessionId
        ? [eq(ets2RecordEvents.session_id, query.sessionId)]
        : []),
      ...(query.jobId ? [eq(ets2RecordEvents.job_id, query.jobId)] : []),
      ...(query.kind ? [eq(ets2RecordEvents.kind, query.kind)] : [])
    ]

    const rows = await db
      .select()
      .from(ets2RecordEvents)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(asc(ets2RecordEvents.created))

    // Pair each event with the truck's position at that moment, taken from the
    // sample recorded closest to the event's game clock.
    const events = await Promise.all(
      rows.map(async event => {
        if (!event.session_id || event.game_min <= 0) {
          return { ...event, x: null, z: null }
        }

        const [nearest] = await db
          .select({ x: ets2RecordSamples.x, z: ets2RecordSamples.z })
          .from(ets2RecordSamples)
          .where(
            and(
              eq(ets2RecordSamples.session_id, event.session_id),
              isNotNull(ets2RecordSamples.game_min)
            )
          )
          .orderBy(sql`abs(${ets2RecordSamples.game_min} - ${event.game_min})`)
          .limit(1)

        return { ...event, x: nearest?.x ?? null, z: nearest?.z ?? null }
      })
    )

    return response.ok(events)
  })
