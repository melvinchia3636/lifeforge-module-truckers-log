import { useModuleTranslation } from '@lifeforge/localization'
import { Box, Flex, Icon, Stack, Text } from '@lifeforge/ui'

import { GAME_ICONS, MARKET_COLORS, MARKET_ICONS } from '@/constants/jobMeta'

import { useJobItemContext } from '../contexts/JobItemContext'
import CityLabel from './CityLabel'

function JobSummary() {
  const job = useJobItemContext()
  const { t } = useModuleTranslation()

  return (
    <Flex align="start" gap="md" minWidth="0" pl="md" position="relative">
      <Box
        bg="custom-500"
        bottom="0"
        left="0"
        position="absolute"
        r="full"
        top="0"
        width="0.25rem"
      />
      <Stack gap="xs" minWidth="0">
        <Flex align="center" gap="xs" minWidth="0">
          <Icon
            color={MARKET_COLORS[job.job_market]}
            icon={MARKET_ICONS[job.job_market] ?? 'tabler:briefcase'}
            size="0.95rem"
          />
          <Text truncate color="muted" size="sm">
            {t(`jobs.market.${job.job_market}`, {
              defaultValue: job.job_market.replace(/_/g, ' ')
            })}
          </Text>
          <Text color="muted" size="sm">
            ·
          </Text>
          <Icon icon={GAME_ICONS[job.game] ?? 'tabler:world'} size="0.9rem" />
          <Text truncate color="muted" size="sm">
            {t(`jobs.game.${job.game}`, {
              defaultValue: job.game.toUpperCase()
            })}
          </Text>
        </Flex>
        <Flex align="baseline" gap="sm" minWidth="0">
          <Text truncate size="lg" weight="semibold">
            {job.cargo || t('jobs.unknownCargo')}
          </Text>
          <Text color="muted" size="sm" whiteSpace="nowrap">
            {job.cargo_mass_kg > 0
              ? `(${(job.cargo_mass_kg / 1000).toFixed(1)} t)`
              : null}
          </Text>
        </Flex>
        <Flex align="center" gap="xs" minWidth="0">
          <CityLabel cityId={job.city_src_id} name={job.city_src} />
          <Icon color="muted" icon="tabler:arrow-right" />
          <CityLabel cityId={job.city_dst_id} name={job.city_dst} />
        </Flex>
        <Flex align="center" gap="xs" minWidth="0">
          <Text truncate color="muted" size="sm">
            {job.comp_src}
          </Text>
          <Icon color="muted" icon="tabler:arrow-right" />
          <Text truncate color="muted" size="sm">
            {job.comp_dst}
          </Text>
        </Flex>
      </Stack>
    </Flex>
  )
}

export default JobSummary
