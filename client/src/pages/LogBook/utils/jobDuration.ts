import type { Job } from '@/pages/LogBook'

export function formatDuration(minutes: number): string {
  const total = Math.max(0, Math.round(minutes))

  const hours = Math.floor(total / 60)

  const mins = total % 60

  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

/**
 * In-game duration of a job, in minutes. Prefers the game-clock span; falls back
 * to the SDK's delivery-time field when the recorded start is a 0 sentinel.
 */
export function jobGameDurationMin(job: Job): number | null {
  if (
    job.started_game_min != null &&
    job.started_game_min > 0 &&
    job.finished_game_min != null
  ) {
    return job.finished_game_min - job.started_game_min
  }

  return job.delivery_time_min
}
