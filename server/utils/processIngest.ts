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

type DbTx = Parameters<Parameters<ModuleDb['transaction']>[0]>[0]

/** Age after which an idle active session is considered interrupted. */
const STALE_MS = Number(process.env.ETS2_RECORD_STALE_MS ?? 10 * 60 * 1000)

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals

  return Math.round(value * factor) / factor
}

async function recomputeStats(tx: DbTx, jobId: string): Promise<void> {
  const job = await tx.query.jobs.findFirst({ where: { id: jobId } })

  if (!job) return

  const windowEnd = job.finished_at?.getTime() ?? Date.now()

  const rows = job.session_id
    ? await tx.query.samples.findMany({
        where: {
          session_id: job.session_id,
          t_ms: { gte: job.started_at.getTime(), lte: windowEnd }
        },
        orderBy: { t_ms: 'asc' }
      })
    : []

  const first = rows[0]

  if (!first) {
    await tx
      .update(ets2RecordJobs)
      .set({ sample_count: 0, updated: new Date() })
      .where(eq(ets2RecordJobs.id, jobId))

    return
  }

  let maxSpeed = 0

  let minOdo = first.odometer_km

  let maxOdo = first.odometer_km

  let fuelUsed = 0

  let adblueUsed = 0

  let idleMs = 0

  let prev = first

  for (const s of rows) {
    maxSpeed = Math.max(maxSpeed, s.speed_kmh)
    minOdo = Math.min(minOdo, s.odometer_km)
    maxOdo = Math.max(maxOdo, s.odometer_km)
    fuelUsed += Math.max(0, prev.fuel_l - s.fuel_l)
    adblueUsed += Math.max(0, prev.adblue_l - s.adblue_l)

    const dt = Math.min(s.t_ms - prev.t_ms, 5000)

    if (prev.engine_on && prev.speed_kmh < 1) idleMs += Math.max(0, dt)
    prev = s
  }

  const distance = Math.max(0, maxOdo - minOdo)

  const driveMin = job.delivery_time_min

  const avgSpeed =
    driveMin !== null && driveMin > 0 ? distance / (driveMin / 60) : null

  await tx
    .update(ets2RecordJobs)
    .set({
      sample_count: rows.length,
      distance_km: round(distance, 2),
      max_speed_kmh: round(maxSpeed, 1),
      avg_speed_kmh: avgSpeed === null ? null : round(avgSpeed, 1),
      fuel_used_l: round(fuelUsed, 2),
      adblue_used_l: round(adblueUsed, 3),
      idle_min: round(idleMs / 60000, 2),
      updated: new Date()
    })
    .where(eq(ets2RecordJobs.id, jobId))
}

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

        await recomputeStats(tx, job.id)

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

        await recomputeStats(tx, job.id)

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
