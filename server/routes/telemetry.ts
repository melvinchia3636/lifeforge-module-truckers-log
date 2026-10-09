import forge from '../forge'
import { processIngest } from '../utils/processIngest'
import { ingestBodySchema } from '../utils/schemas'
import { tokenMatches } from '../utils/token'

export const ingest = forge
  .mutation({
    description:
      'Receive a batch of ETS2/ATS telemetry from a remote recording agent.',
    noAuth: true,
    encrypted: false,
    rateLimit: false,
    input: {
      body: ingestBodySchema
    },
    output: 'custom'
  })
  .callback(async ({ db, body: { token, clientId, messages }, res }) => {
    const settings = await db.query.settings.findFirst()

    if (!settings || !tokenMatches(token, settings.ingest_token_hash)) {
      return res.status(401).json({ error: 'Invalid ingest token' })
    }

    if (messages.length === 0) {
      return res.json({ accepted: 0 })
    }

    const accepted = await processIngest(db, { clientId, messages })

    return res.json({ accepted })
  })
