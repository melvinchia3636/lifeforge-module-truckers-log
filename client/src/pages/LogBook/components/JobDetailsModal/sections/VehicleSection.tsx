import { Flex, Icon, Text } from '@lifeforge/ui'

import { brandIcon } from '@/constants/jobMeta'

import DetailRow from '../components/DetailRow'
import Section from '../components/Section'
import { useJobDetails } from '../contexts/JobDetailsContext'

function VehicleSection() {
  const job = useJobDetails()

  const truck = [job.truck_brand, job.truck_name].filter(Boolean).join(' ')

  const rows = [
    {
      icon: 'tabler:truck',
      label: 'truck',
      children: (
        <Flex align="center" gap="sm" justify={{ sm: 'end' }}>
          <Icon icon={brandIcon(job.truck_brand)} />
          <Text align={{ sm: 'right' }}>{truck || '—'}</Text>
        </Flex>
      )
    },
    Boolean(job.truck_plate) && {
      icon: 'tabler:id',
      label: 'plate',
      children: (
        <Text align={{ sm: 'right' }} style={{ fontFamily: 'monospace' }}>
          {job.truck_plate}
        </Text>
      )
    }
  ]

  return (
    <Section title="vehicle">
      <DetailRow rows={rows} />
    </Section>
  )
}

export default VehicleSection
