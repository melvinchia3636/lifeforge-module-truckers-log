import dayjs from 'dayjs'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  colorWithOpacity,
  Flex,
  Icon,
  Text,
  usePersonalization
} from '@lifeforge/ui'

import { brandIcon, MARKET_COLORS, MARKET_ICONS } from '@/constants/jobMeta'

import { useJobDetails } from '../contexts/JobDetailsContext'

function Header() {
  const job = useJobDetails()
  const { t } = useModuleTranslation()
  const { language } = usePersonalization()

  const truck = [job.truck_brand, job.truck_name].filter(Boolean).join(' ')
  const marketColor = MARKET_COLORS[job.job_market] ?? 'custom-500'

  return (
    <Flex centered align="center" direction="column">
      <Box
        bg={colorWithOpacity(
          marketColor as Parameters<typeof colorWithOpacity>[0],
          '10%'
        )}
        mb="lg"
        p="lg"
        r="lg"
      >
        <Icon
          color={marketColor}
          icon={MARKET_ICONS[job.job_market] ?? 'tabler:briefcase'}
          size="2rem"
        />
      </Box>
      <Text align="center" size="3xl" weight="medium">
        {job.cargo || t('jobs.unknownCargo')}
      </Text>
      {(job.city_src || job.city_dst) && (
        <Text align="center" color="muted" mt="sm" size="lg">
          {job.city_src} → {job.city_dst}
        </Text>
      )}
      {truck && (
        <Flex align="center" gap="xs" mt="sm">
          <Icon color="muted" icon={brandIcon(job.truck_brand)} />
          <Text color="muted">{truck}</Text>
        </Flex>
      )}
      <Text align="center" color="muted" mt="sm">
        {dayjs(job.started_at)
          .locale(language)
          .format('dddd, D MMM YYYY · HH:mm')}
      </Text>
    </Flex>
  )
}

export default Header
