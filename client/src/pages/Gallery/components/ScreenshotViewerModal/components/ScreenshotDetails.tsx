import dayjs from 'dayjs'

import { useModuleTranslation } from '@lifeforge/localization'
import { Card, Text, surface, usePersonalization } from '@lifeforge/ui'

import type { Screenshot } from '@/pages/Gallery'
import DetailRow from '@/pages/LogBook/components/JobDetailsModal/components/DetailRow'

function ScreenshotDetails({ screenshot }: { screenshot: Screenshot }) {
  const { t } = useModuleTranslation()
  const { language } = usePersonalization()

  const truck = [screenshot.truck_brand, screenshot.truck_name]
    .filter(Boolean)
    .join(' ')

  const coordinates =
    screenshot.x != null && screenshot.z != null
      ? `${screenshot.x.toFixed(0)}, ${screenshot.z.toFixed(0)}`
      : null

  const resolution =
    screenshot.width && screenshot.height
      ? `${screenshot.width} × ${screenshot.height}`
      : null

  const rows = [
    {
      icon: 'tabler:calendar',
      label: 'captured',
      children: (
        <Text align={{ sm: 'right' }}>
          {dayjs(screenshot.captured_at)
            .locale(language)
            .format('D MMM YYYY, HH:mm:ss')}
        </Text>
      )
    },
    {
      icon: 'tabler:world',
      label: 'game',
      children: (
        <Text align={{ sm: 'right' }}>
          {t(`jobs.game.${screenshot.game}`, {
            defaultValue: screenshot.game.toUpperCase()
          })}
        </Text>
      )
    },
    coordinates
      ? {
          icon: 'tabler:map-pin',
          label: 'location',
          children: <Text align={{ sm: 'right' }}>{coordinates}</Text>
        }
      : null,
    screenshot.speed_kmh != null
      ? {
          icon: 'tabler:gauge',
          label: 'avgSpeed',
          children: (
            <Text align={{ sm: 'right' }}>
              {screenshot.speed_kmh.toFixed(0)} km/h
            </Text>
          )
        }
      : null,
    truck
      ? {
          icon: 'tabler:truck',
          label: 'truck',
          children: <Text align={{ sm: 'right' }}>{truck}</Text>
        }
      : null,
    resolution
      ? {
          icon: 'tabler:photo',
          label: 'resolution',
          children: <Text align={{ sm: 'right' }}>{resolution}</Text>
        }
      : null
  ]

  return (
    <Card
      bg={surface.light}
      gap="none"
      mt="lg"
      overflow="hidden"
      p="none"
      width="100%"
    >
      <DetailRow rows={rows} />
    </Card>
  )
}

export default ScreenshotDetails
