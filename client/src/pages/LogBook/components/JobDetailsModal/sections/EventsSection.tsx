import { useModuleTranslation } from '@lifeforge/localization'
import { Flex, Text, WithQueryData } from '@lifeforge/ui'

import { currencyFor } from '@/constants/jobMeta'
import { forgeAPI } from '@/manifest'

import DetailRow from '../components/DetailRow'
import Section from '../components/Section'
import { useJobDetails } from '../contexts/JobDetailsContext'
import EventDetail from './EventDetail'

const EVENT_ICONS: Record<string, string> = {
  fine: 'tabler:gavel',
  refuel: 'tabler:gas-station',
  tollgate: 'tabler:barrier-block',
  ferry: 'tabler:ship',
  train: 'tabler:train'
}

function EventsSection() {
  const job = useJobDetails()
  const { t } = useModuleTranslation()

  const currency = currencyFor(job.game)

  return (
    <WithQueryData contract={forgeAPI.events.list.input({ jobId: job.id })}>
      {events => {
        const rows = events.map(event => ({
          icon: EVENT_ICONS[event.kind] ?? 'tabler:flag',
          label: event.kind,
          children: (
            <Flex align="center" gap="sm" justify={{ sm: 'end' }} wrap="wrap">
              {event.amount !== 0 && (
                <Text align={{ sm: 'right' }} color="dangerous">
                  {`-${currency}${Math.abs(event.amount).toLocaleString()}`}
                </Text>
              )}
              {event.detail && <EventDetail detail={event.detail} />}
              {event.amount === 0 && !event.detail && (
                <Text align={{ sm: 'right' }}>{t('details.yes')}</Text>
              )}
            </Flex>
          )
        }))

        return events.length === 0 ? null : (
          <Section title="events">
            <DetailRow rows={rows} />
          </Section>
        )
      }}
    </WithQueryData>
  )
}

export default EventsSection
