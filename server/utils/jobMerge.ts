import { and, asc, eq, gte, inArray, lte } from 'drizzle-orm'

import {
  ets2RecordEvents,
  ets2RecordJobs,
  ets2RecordSamples,
  ets2RecordSessions
} from '../schema.drizzle'
import type { ModuleDb } from './processIngest'

type JobRow = typeof ets2RecordJobs.$inferSelect

/**
 * Fields that must match for a job to be considered the same physical freight.
 * A job that gets interrupted and later delivered re-emits `job-started` with
 * the same metadata, so this is what ties the interrupted rows to the final one.
 */
const METADATA_FIELDS = [
  'game',
  'cargo_id',
  'city_src_id',
  'comp_src_id',
  'city_dst_id',
  'comp_dst_id'
] as const

/** The job columns needed to match a job against its predecessors. */
const candidateColumns = {
  id: ets2RecordJobs.id,
  session_id: ets2RecordJobs.session_id,
  status: ets2RecordJobs.status,
  started_at: ets2RecordJobs.started_at,
  finished_at: ets2RecordJobs.finished_at,
  started_game_min: ets2RecordJobs.started_game_min,
  game: ets2RecordJobs.game,
  cargo_id: ets2RecordJobs.cargo_id,
  city_src_id: ets2RecordJobs.city_src_id,
  comp_src_id: ets2RecordJobs.comp_src_id,
  city_dst_id: ets2RecordJobs.city_dst_id,
  comp_dst_id: ets2RecordJobs.comp_dst_id,
  client_id: ets2RecordSessions.client_id
}

type CandidateJob = {
  id: string
  session_id: string | null
  status: JobRow['status']
  started_at: Date
  finished_at: Date | null
  started_game_min: number | null
  game: JobRow['game']
  cargo_id: string
  city_src_id: string
  comp_src_id: string
  city_dst_id: string
  comp_dst_id: string
  client_id: string
}

function sameJobMetadata(a: CandidateJob | JobRow, b: CandidateJob | JobRow) {
  return METADATA_FIELDS.every(field => a[field] === b[field])
}

/** Every job owned by the given clients, oldest first. */
function fetchClientJobs(db: ModuleDb, clientIds: string[]) {
  if (clientIds.length === 0) return Promise.resolve([] as CandidateJob[])

  return db
    .select(candidateColumns)
    .from(ets2RecordJobs)
    .innerJoin(
      ets2RecordSessions,
      eq(ets2RecordJobs.session_id, ets2RecordSessions.id)
    )
    .where(inArray(ets2RecordSessions.client_id, clientIds))
    .orderBy(asc(ets2RecordJobs.started_at))
}

/**
 * Walks backwards from `target` through a client's job list, collecting the
 * uninterrupted run of `interrupted` jobs that share the target's metadata.
 * The run stops at the first job that is not a matching interruption, so a
 * genuinely repeated route after another job is never pulled in.
 */
function collectPredecessors(
  jobs: CandidateJob[],
  target: CandidateJob | JobRow
): CandidateJob[] {
  const index = jobs.findIndex(job => job.id === target.id)

  if (index < 0) return []

  const candidates: CandidateJob[] = []

  for (let i = index - 1; i >= 0; i--) {
    const job = jobs[i]

    if (!job) break

    if (job.status === 'interrupted' && sameJobMetadata(job, target)) {
      candidates.unshift(job)
    } else {
      break
    }
  }

  return candidates
}

/** The consecutive interrupted jobs that a delivered job can absorb. */
export async function findMergeCandidates(
  db: ModuleDb,
  target: JobRow
): Promise<CandidateJob[]> {
  if (target.status !== 'delivered' || !target.session_id) return []

  const session = await db.query.sessions.findFirst({
    where: { id: target.session_id }
  })

  if (!session?.client_id) return []

  const jobs = await fetchClientJobs(db, [session.client_id])

  return collectPredecessors(jobs, target)
}

/** How many interrupted jobs each of the given delivered jobs can absorb. */
export async function mergeableCountsFor(
  db: ModuleDb,
  rows: JobRow[]
): Promise<Map<string, number>> {
  const counts = new Map<string, number>()

  const delivered = rows.filter(row => row.status === 'delivered' && row.session_id)

  if (delivered.length === 0) return counts

  const sessionIds = [...new Set(delivered.map(row => row.session_id as string))]

  const sessions = await db
    .select({ id: ets2RecordSessions.id, client_id: ets2RecordSessions.client_id })
    .from(ets2RecordSessions)
    .where(inArray(ets2RecordSessions.id, sessionIds))

  const clientBySession = new Map(sessions.map(s => [s.id, s.client_id]))

  const clientIds = [...new Set(sessions.map(s => s.client_id))]

  const jobs = await fetchClientJobs(db, clientIds)

  const jobsByClient = new Map<string, CandidateJob[]>()

  for (const job of jobs) {
    const bucket = jobsByClient.get(job.client_id) ?? []

    bucket.push(job)

    jobsByClient.set(job.client_id, bucket)
  }

  for (const row of delivered) {
    const clientId = clientBySession.get(row.session_id as string)

    const jobsForClient = (clientId && jobsByClient.get(clientId)) || []

    counts.set(row.id, collectPredecessors(jobsForClient, row).length)
  }

  return counts
}

/**
 * Folds a delivered job's consecutive interrupted predecessors into it:
 * their in-window samples and events are re-pointed at the delivered job's
 * session, the delivered job's window is widened to the earliest start, and
 * the interrupted rows are deleted.
 */
export async function mergeJob(db: ModuleDb, target: JobRow): Promise<number> {
  const candidates = await findMergeCandidates(db, target)

  if (candidates.length === 0) return 0

  const targetSessionId = target.session_id

  await db.transaction(async tx => {
    for (const candidate of candidates) {
      if (
        targetSessionId &&
        candidate.session_id &&
        candidate.session_id !== targetSessionId
      ) {
        const end = (candidate.finished_at ?? new Date()).getTime()

        await tx
          .update(ets2RecordSamples)
          .set({ session_id: targetSessionId })
          .where(
            and(
              eq(ets2RecordSamples.session_id, candidate.session_id),
              gte(ets2RecordSamples.t_ms, candidate.started_at.getTime()),
              lte(ets2RecordSamples.t_ms, end)
            )
          )
      }

      await tx
        .update(ets2RecordEvents)
        .set({ session_id: targetSessionId ?? null, job_id: target.id })
        .where(eq(ets2RecordEvents.job_id, candidate.id))
    }

    const earliest = candidates.reduce((acc, candidate) =>
      candidate.started_at < acc.started_at ? candidate : acc
    )

    // Prefer the earliest valid in-game start across the merged chain; a 0 is
    // the SDK's "unavailable" sentinel and must not win over a real value.
    const gameStarts = [target.started_game_min, ...candidates.map(c => c.started_game_min)].filter(
      (value): value is number => value != null && value > 0
    )

    const startedGameMin = gameStarts.length > 0 ? Math.min(...gameStarts) : target.started_game_min

    await tx
      .update(ets2RecordJobs)
      .set({
        started_at: earliest.started_at,
        started_game_min: startedGameMin,
        updated: new Date()
      })
      .where(eq(ets2RecordJobs.id, target.id))

    await tx
      .delete(ets2RecordJobs)
      .where(inArray(
        ets2RecordJobs.id,
        candidates.map(candidate => candidate.id)
      ))
  })

  return candidates.length
}
