import dayjs from 'dayjs'

import { useModuleTranslation } from '@lifeforge/localization'
import { Stack, Text, usePersonalization } from '@lifeforge/ui'

import DetailRow from '../components/DetailRow'
import Section from '../components/Section'
import { useJobDetails } from '../contexts/JobDetailsContext'
import { formatDuration, jobDistance } from '../utils'

function JourneySection() {
  const job = useJobDetails()
  const { t } = useModuleTranslation()
  const { language } = usePersonalization()

  const distance = jobDistance(job)

  // The game-clock span is the actual in-game elapsed time. The SDK's
  // `delivery_time_min` tracks real time, so it isn't used as a fallback - the
  // in-game line is simply omitted when the recorded start is a 0 sentinel.
  const gameMin =
    job.started_game_min != null &&
    job.started_game_min > 0 &&
    job.finished_game_min != null
      ? job.finished_game_min - job.started_game_min
      : null

  const realMin = job.finished_at
    ? dayjs(job.finished_at).diff(job.started_at, 'minute')
    : null

  const subDistances = [
    job.planned_distance_km != null
      ? `${t('details.planned')} ${job.planned_distance_km} km`
      : null,
    job.distance_km != null
      ? `${t('details.recorded')} ${job.distance_km} km`
      : null
  ]
    .filter(Boolean)
    .join(' · ')

  const rows = [
    {
      icon: 'tabler:road',
      label: 'distance',
      children: (
        <Stack align={{ sm: 'end' }} gap="xs">
          <Text align={{ sm: 'right' }}>
            {distance != null ? `${distance} km` : '—'}
          </Text>
          {subDistances && (
            <Text align={{ sm: 'right' }} color="muted" size="sm">
              {subDistances}
            </Text>
          )}
        </Stack>
      )
    },
    {
      icon: 'tabler:clock',
      label: 'duration',
      children:
        gameMin == null && realMin == null ? (
          <Text align={{ sm: 'right' }}>—</Text>
        ) : (
          <Stack align={{ sm: 'end' }} gap="xs">
            {gameMin != null && (
              <Text align={{ sm: 'right' }}>
                {`${formatDuration(gameMin)} ${t('details.inGame')}`}
              </Text>
            )}
            {realMin != null && (
              <Text align={{ sm: 'right' }} color="muted" size="sm">
                {`${formatDuration(realMin)} ${t('details.realTime')}`}
              </Text>
            )}
          </Stack>
        )
    },
    {
      icon: 'tabler:calendar-up',
      label: 'started',
      children: (
        <Text align={{ sm: 'right' }}>
          {dayjs(job.started_at).locale(language).format('D MMM YYYY, HH:mm')}
        </Text>
      )
    },
    {
      icon: 'tabler:calendar-down',
      label: 'finished',
      children: (
        <Text align={{ sm: 'right' }}>
          {job.finished_at
            ? dayjs(job.finished_at)
                .locale(language)
                .format('D MMM YYYY, HH:mm')
            : '—'}
        </Text>
      )
    }
  ]

  return (
    <Section title="journey">
      <DetailRow rows={rows} />
    </Section>
  )
}

export default JourneySection
