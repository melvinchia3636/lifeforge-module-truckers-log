import { Stack, Text } from '@lifeforge/ui'

import DetailRow from '../components/DetailRow'
import Section from '../components/Section'
import { useJobDetails } from '../contexts/JobDetailsContext'
import { formatDuration, jobDistance } from '../utils'

function DrivingSection() {
  const job = useJobDetails()

  const distance = jobDistance(job)

  const consumption =
    distance != null && distance > 0 ? (job.fuel_used_l / distance) * 100 : null

  const rows = [
    {
      icon: 'tabler:gauge',
      label: 'avgSpeed',
      children: (
        <Text align={{ sm: 'right' }}>
          {job.avg_speed_kmh != null ? `${job.avg_speed_kmh} km/h` : '—'}
        </Text>
      )
    },
    {
      icon: 'tabler:dashboard',
      label: 'maxSpeed',
      children: (
        <Text align={{ sm: 'right' }}>
          {job.max_speed_kmh != null ? `${job.max_speed_kmh} km/h` : '—'}
        </Text>
      )
    },
    {
      icon: 'tabler:gas-station',
      label: 'fuel',
      children: (
        <Stack align={{ sm: 'end' }} gap="xs">
          <Text align={{ sm: 'right' }}>{`${job.fuel_used_l} L`}</Text>
          {consumption != null && (
            <Text align={{ sm: 'right' }} color="muted" size="sm">
              {`${consumption.toFixed(1)} L/100km`}
            </Text>
          )}
        </Stack>
      )
    },
    {
      icon: 'tabler:bottle',
      label: 'adblue',
      children: (
        <Text align={{ sm: 'right' }}>{`${job.adblue_used_l} L`}</Text>
      )
    },
    {
      icon: 'tabler:hourglass',
      label: 'idle',
      children: (
        <Text align={{ sm: 'right' }}>{formatDuration(job.idle_min)}</Text>
      )
    },
    {
      icon: 'tabler:database',
      label: 'samples',
      children: (
        <Text align={{ sm: 'right' }}>{job.sample_count.toLocaleString()}</Text>
      )
    }
  ]

  return (
    <Section title="driving">
      <DetailRow rows={rows} />
    </Section>
  )
}

export default DrivingSection
