import { and, desc, eq, gte, lte } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-orm/zod'
import z from 'zod'

import forge from '../forge'
import { ets2RecordJobs } from '../schema.drizzle'

const jobDto = createSelectSchema(ets2RecordJobs)

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
        to: z.string().optional()
      })
    },
    output: {
      OK: z.array(jobDto)
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

    const rows = await db
      .select()
      .from(ets2RecordJobs)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(desc(ets2RecordJobs.started_at))

    return response.ok(rows)
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

    return response.ok(job)
  })
