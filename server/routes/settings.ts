import { eq } from 'drizzle-orm'
import z from 'zod'

import forge from '../forge'
import { ets2RecordSettings } from '../schema.drizzle'
import { generateToken, hashToken } from '../utils/token'

export const get = forge
  .query({
    description: 'Get the ingest token metadata (the token itself is masked).',
    output: {
      OK: z.object({
        tokenLast4: z.string().nullable(),
        tokenCreated: z.date().nullable()
      })
    }
  })
  .callback(async ({ db, response }) => {
    const settings = await db.query.settings.findFirst()

    return response.ok({
      tokenLast4: settings?.ingest_token_hash
        ? settings.ingest_token_last4
        : null,
      tokenCreated: settings?.ingest_token_created ?? null
    })
  })

export const rotate = forge
  .mutation({
    description:
      'Rotate the ingest token. The new raw token is returned only once.',
    output: {
      OK: z.object({
        token: z.string(),
        tokenLast4: z.string()
      })
    }
  })
  .callback(async ({ db, response }) => {
    const token = generateToken()

    const tokenLast4 = token.slice(-4)

    const settings = await db.query.settings.findFirst()

    if (settings) {
      await db
        .update(ets2RecordSettings)
        .set({
          ingest_token_hash: hashToken(token),
          ingest_token_last4: tokenLast4,
          ingest_token_created: new Date(),
          updated: new Date()
        })
        .where(eq(ets2RecordSettings.id, settings.id))
    } else {
      await db.insert(ets2RecordSettings).values({
        ingest_token_hash: hashToken(token),
        ingest_token_last4: tokenLast4,
        ingest_token_created: new Date()
      })
    }

    return response.ok({ token, tokenLast4 })
  })
