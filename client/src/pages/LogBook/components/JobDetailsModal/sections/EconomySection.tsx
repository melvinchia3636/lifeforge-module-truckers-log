import { Text } from '@lifeforge/ui'

import { currencyFor } from '@/constants/jobMeta'

import DetailRow from '../components/DetailRow'
import Section from '../components/Section'
import { useJobDetails } from '../contexts/JobDetailsContext'

function EconomySection() {
  const job = useJobDetails()

  const currency = currencyFor(job.game)

  const rows = [
    {
      icon: 'tabler:cash',
      label: 'revenue',
      children: (
        <Text align={{ sm: 'right' }} weight="medium">
          {`${currency}${job.revenue.toLocaleString()}`}
        </Text>
      )
    },
    job.income !== 0 && {
      icon: 'tabler:arrow-down-circle',
      label: 'income',
      children: (
        <Text align={{ sm: 'right' }}>
          {`${currency}${job.income.toLocaleString()}`}
        </Text>
      )
    },
    job.penalty !== 0 && {
      icon: 'tabler:arrow-up-circle',
      label: 'penalty',
      children: (
        <Text align={{ sm: 'right' }} color="dangerous">
          {`-${currency}${job.penalty.toLocaleString()}`}
        </Text>
      )
    },
    {
      icon: 'tabler:star',
      label: 'xp',
      children: (
        <Text align={{ sm: 'right' }}>{job.xp.toLocaleString()}</Text>
      )
    }
  ]

  return (
    <Section title="economy">
      <DetailRow rows={rows} />
    </Section>
  )
}

export default EconomySection
