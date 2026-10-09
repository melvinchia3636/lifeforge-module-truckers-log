import { and, desc, eq, gte, lte } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-orm/zod'
import z from 'zod'

import forge from '../forge'
import { ets2RecordSessions } from '../schema.drizzle'

const sessionDto = createSelectSchema(ets2RecordSessions)

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
