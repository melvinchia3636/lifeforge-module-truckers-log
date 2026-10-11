import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { useModuleTranslation } from '@lifeforge/localization'
import { Grid, usePersonalization } from '@lifeforge/ui'

import { brandIcon, currencyFor } from '@/constants/jobMeta'
import {
  formatDuration,
  jobGameDurationMin
} from '@/pages/LogBook/utils/jobDuration'

import { useJobItemContext } from '../contexts/JobItemContext'
import JobStat from './JobStat'

dayjs.extend(relativeTime)

function JobStats() {
  const job = useJobItemContext()
  const { t } = useModuleTranslation()
  const { language } = usePersonalization()

  const truck = [job.truck_brand, job.truck_name].filter(Boolean).join(' ')

  const distance =
    job.delivered_distance_km ?? job.distance_km ?? job.planned_distance_km

  const durationMin = jobGameDurationMin(job)

  const currency = currencyFor(job.game)

  const stats = [
    {
      icon: 'tabler:road',
      label: t('jobs.distance'),
      value: distance != null ? `${distance.toFixed(2)} km` : '—'
    },
    {
      icon: 'tabler:clock',
      label: t('jobs.duration'),
      value: durationMin != null ? formatDuration(durationMin) : '—'
    },
    {
      icon: 'tabler:cash',
      label: t('jobs.revenue'),
      value: `${currency}${job.revenue.toLocaleString()}`
    },
    {
      icon: 'tabler:star',
      label: t('jobs.xp'),
      value: job.xp.toLocaleString()
    },
    {
      icon: 'tabler:truck',
      label: t('jobs.truck'),
      value: truck || '—',
      valueIcon: brandIcon(job.truck_brand)
    },
    {
      icon: 'tabler:calendar',
      label: t('jobs.date'),
      value: dayjs(job.started_at).locale(language).fromNow()
    }
  ]

  return (
    <Grid gap="md" templateCols={{ base: 2, sm: 3, lg: 6 }}>
      {stats.map(stat => (
        <JobStat key={stat.label} {...stat} />
      ))}
    </Grid>
  )
}

export default JobStats
