import type { Job } from '@/pages/LogBook'

export function formatDuration(minutes: number): string {
  const total = Math.max(0, Math.round(minutes))

  const hours = Math.floor(total / 60)

  const mins = total % 60

  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

/**
 * Duration of a job in minutes. Prefers the game-clock span because it reflects
 * the in-game time; falls back to `delivery_time_min` (real time) for interrupted
 * or cancelled jobs that never got a game-clock finish timestamp.
 */
export function jobGameDurationMin(job: Job): number | null {
  if (
    job.started_game_min != null &&
    job.started_game_min > 0 &&
    job.finished_game_min != null
  ) {
    return job.finished_game_min - job.started_game_min
  }

  if (job.delivery_time_min != null && job.delivery_time_min > 0) {
    return job.delivery_time_min
  }

  return null
}
