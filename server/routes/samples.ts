import { and, asc, eq, gte, lte } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-orm/zod'
import z from 'zod'

import forge from '../forge'
import { ets2RecordSamples, ets2RecordSessions } from '../schema.drizzle'

const sampleDto = createSelectSchema(ets2RecordSamples)

export const list = forge
  .query({
    description: 'List telemetry samples for a session.',
    input: {
      query: z.object({
        sessionId: forge.existsIn(z.string(), ets2RecordSessions),
        from: z.string().optional(),
        to: z.string().optional(),
        limit: z.string().optional()
      })
    },
    output: {
      OK: z.array(sampleDto)
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
      .select()
      .from(ets2RecordSamples)
      .where(and(...filters))
      .orderBy(asc(ets2RecordSamples.t_ms))
      .limit(query.limit ? Number(query.limit) : 10000)

    return response.ok(rows)
  })
