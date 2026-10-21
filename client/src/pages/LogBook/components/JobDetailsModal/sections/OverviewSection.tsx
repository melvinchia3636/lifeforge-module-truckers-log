import { useModuleTranslation } from '@lifeforge/localization'
import { Flex, Icon, TagChip, Text } from '@lifeforge/ui'

import {
  GAME_ICONS,
  MARKET_COLORS,
  MARKET_ICONS,
  STATUS_COLORS,
  STATUS_ICONS
} from '@/constants/jobMeta'

import DetailRow from '../components/DetailRow'
import Section from '../components/Section'
import { useJobDetails } from '../contexts/JobDetailsContext'

function OverviewSection() {
  const job = useJobDetails()
  const { t } = useModuleTranslation()

  const rows = [
    {
      icon: 'tabler:circle-dot',
      label: 'status',
      children: (
        <TagChip
          color={STATUS_COLORS[job.status]}
          icon={STATUS_ICONS[job.status]}
          label={t(`jobs.status.${job.status}`)}
        />
      )
    },
    {
      icon: 'tabler:device-gamepad-2',
      label: 'game',
      children: (
        <Flex align="center" gap="sm" justify={{ sm: 'end' }}>
          <Icon icon={GAME_ICONS[job.game] ?? 'tabler:world'} />
          <Text align={{ sm: 'right' }}>
            {t(`jobs.game.${job.game}`, {
              defaultValue: job.game.toUpperCase()
            })}
          </Text>
        </Flex>
      )
    },
    {
      icon: 'tabler:briefcase',
      label: 'market',
      children: (
        <Flex align="center" gap="sm" justify={{ sm: 'end' }}>
          <Icon
            color={MARKET_COLORS[job.job_market]}
            icon={MARKET_ICONS[job.job_market] ?? 'tabler:briefcase'}
          />
          <Text align={{ sm: 'right' }}>
            {t(`jobs.market.${job.job_market}`, {
              defaultValue: job.job_market.replace(/_/g, ' ')
            })}
          </Text>
        </Flex>
      )
    },
    (job.autopark || job.autoload) && {
      icon: 'tabler:robot',
      label: 'automation',
      children: (
        <Flex align="center" gap="sm" justify={{ sm: 'end' }} wrap="wrap">
          {job.autopark && (
            <TagChip
              color="#22c55e"
              icon="tabler:parking"
              label={t('details.autopark')}
            />
          )}
          {job.autoload && (
            <TagChip
              color="#22c55e"
              icon="tabler:package-import"
              label={t('details.autoload')}
            />
          )}
        </Flex>
      )
    }
  ]

  return (
    <Section title="overview">
      <DetailRow rows={rows} />
    </Section>
  )
}

export default OverviewSection
