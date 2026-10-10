import type { Job } from '@/pages/LogBook'

export { formatDuration } from '@/pages/LogBook/utils/jobDuration'

export function jobDistance(job: Job): number | null {
  return job.delivered_distance_km ?? job.distance_km ?? job.planned_distance_km
}
