import { and, eq } from 'drizzle-orm'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

import type { BuiltModuleSchema } from '@lifeforge/module-registry'

import * as schema from '../schema.drizzle'
import {
  ets2RecordEvents,
  ets2RecordJobs,
  ets2RecordSamples,
  ets2RecordSessions
} from '../schema.drizzle'
import type { IngestMessage } from './schemas'

export type ModuleDb = PostgresJsDatabase<BuiltModuleSchema<typeof schema>>

/** Age after which an idle active session is considered interrupted. */
const STALE_MS = Number(process.env.ETS2_RECORD_STALE_MS ?? 10 * 60 * 1000)

export interface ProcessIngestInput {
  clientId: string
  messages: IngestMessage[]
}

/**
 * Applies a batch of telemetry messages for a client, deriving the active
 * session/job from the database so the endpoint stays stateless.
 */
export async function processIngest(
  db: ModuleDb,
  { clientId, messages }: ProcessIngestInput
): Promise<number> {
  await db.transaction(async tx => {
    const cutoff = Date.now() - STALE_MS

    const activeSessions = await tx.query.sessions.findMany({
      where: { client_id: clientId, status: 'active' }
    })

    for (const stale of activeSessions) {
      const latest = await tx.query.samples.findFirst({
        where: { session_id: stale.id },
        orderBy: { t_ms: 'desc' }
      })

      const lastT = latest?.t_ms ?? stale.started_at.getTime()

      if (lastT < cutoff) {
        await tx
          .update(ets2RecordSessions)
          .set({
            status: 'interrupted',
            finished_at: new Date(),
            updated: new Date()
          })
          .where(eq(ets2RecordSessions.id, stale.id))

        await tx
          .update(ets2RecordJobs)
          .set({
            status: 'interrupted',
            finished_at: new Date(),
            updated: new Date()
          })
          .where(
            and(
              eq(ets2RecordJobs.session_id, stale.id),
              eq(ets2RecordJobs.status, 'active')
            )
          )
      }
    }

    let session =
      (await tx.query.sessions.findFirst({
        where: { client_id: clientId, status: 'active' },
        orderBy: { started_at: 'desc' }
      })) ?? null

    let job = session
      ? ((await tx.query.jobs.findFirst({
          where: { session_id: session.id, status: 'active' },
          orderBy: { started_at: 'desc' }
        })) ?? null)
      : null

    let lastFrameT: number | null = null

    async function ensureSession(startedAtMs: number) {
      if (session) return session

      const rows = await tx
        .insert(ets2RecordSessions)
        .values({
          client_id: clientId,
          status: 'active',
          started_at: new Date(startedAtMs)
        })
        .returning()

      const row = rows[0]

      if (!row) {
        throw new Error('Failed to create recording session')
      }

      session = row

      return row
    }

    for (const msg of messages) {
      if (msg.type === 'connected') {
        await ensureSession(lastFrameT ?? Date.now())

        continue
      }

      if (msg.type === 'disconnected') {
        if (job) {
          await tx
            .update(ets2RecordJobs)
            .set({
              status: 'interrupted',
              finished_at: new Date(),
              updated: new Date()
            })
            .where(eq(ets2RecordJobs.id, job.id))
          job = null
        }

        if (session) {
          await tx
            .update(ets2RecordSessions)
            .set({
              status: 'completed',
              finished_at: new Date(),
              updated: new Date()
            })
            .where(eq(ets2RecordSessions.id, session.id))
          session = null
        }

        continue
      }

      if (msg.type === 'frame') {
        const {
          game,
          truck_id,
          truck_name,
          truck_brand,
          truck_plate,
          ...sample
        } = msg.frame

        lastFrameT = sample.t_ms

        const current = await ensureSession(sample.t_ms)

        await tx
          .update(ets2RecordSessions)
          .set({
            game,
            truck_id,
            truck_name,
            truck_brand,
            truck_plate,
            updated: new Date()
          })
          .where(eq(ets2RecordSessions.id, current.id))

        // A job may start (and carry the stale pre-swap truck) before the game
        // loads the truck actually being driven - e.g. a quick job's company
        // truck. Keep the active job's truck in sync with the frames.
        if (job && job.truck_id !== (truck_id ?? '')) {
          const jobGame =
            job.game === 'unknown' ? (game ?? 'unknown') : job.game

          const jobTruck = {
            truck_id: truck_id ?? '',
            truck_name: truck_name ?? '',
            truck_brand: truck_brand ?? '',
            truck_plate: truck_plate ?? ''
          }

          await tx
            .update(ets2RecordJobs)
            .set({ game: jobGame, ...jobTruck, updated: new Date() })
            .where(eq(ets2RecordJobs.id, job.id))

          job = { ...job, game: jobGame, ...jobTruck }
        }

        await tx
          .insert(ets2RecordSamples)
          .values({ session_id: current.id, ...sample })

        continue
      }

      if (msg.type === 'job-started') {
        const current = await ensureSession(lastFrameT ?? Date.now())

        if (job) {
          await tx
            .update(ets2RecordJobs)
            .set({
              status: 'interrupted',
              finished_at: new Date(),
              updated: new Date()
            })
            .where(eq(ets2RecordJobs.id, job.id))
        }

        const jobRows = await tx
          .insert(ets2RecordJobs)
          .values({
            session_id: current.id,
            status: 'active',
            started_at: new Date(lastFrameT ?? Date.now()),
            ...msg.job
          })
          .returning()

        const createdJob = jobRows[0]

        if (!createdJob) {
          throw new Error('Failed to create job')
        }

        job = createdJob

        continue
      }

      if (msg.type === 'job-delivered') {
        if (!job) continue

        await tx
          .update(ets2RecordJobs)
          .set({
            ...msg.job,
            status: 'delivered',
            finished_at: new Date(),
            updated: new Date()
          })
          .where(eq(ets2RecordJobs.id, job.id))

        job = null

        continue
      }

      if (msg.type === 'job-cancelled') {
        if (!job) continue

        await tx
          .update(ets2RecordJobs)
          .set({
            ...msg.job,
            status: 'cancelled',
            finished_at: new Date(),
            updated: new Date()
          })
          .where(eq(ets2RecordJobs.id, job.id))

        job = null

        continue
      }

      await tx.insert(ets2RecordEvents).values({
        session_id: session?.id ?? null,
        job_id: job?.id ?? null,
        ...msg.event
      })
    }
  })

  return messages.length
}
