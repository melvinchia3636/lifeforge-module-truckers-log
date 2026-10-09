import { and, asc, eq } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-orm/zod'
import z from 'zod'

import forge from '../forge'
import { ets2RecordEvents } from '../schema.drizzle'

const eventDto = createSelectSchema(ets2RecordEvents)

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

    return response.ok(rows)
  })
