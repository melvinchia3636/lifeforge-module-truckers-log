import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router'

import {
  Card,
  Flex,
  Grid,
  Icon,
  Text,
  colorWithOpacity,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import ScreenshotViewerModal from '@/pages/Gallery/components/ScreenshotViewerModal'
import {
  SCREENSHOT_THUMB,
  screenshotUrl
} from '@/pages/Gallery/components/utils'

import Section from '../components/Section'
import {
  useCloseJobDetailsModal,
  useJobDetails
} from '../contexts/JobDetailsContext'

/**
 * Two rows of the desktop 6-column grid. When there are more, the final tile
 * dims the twelfth image and overlays a "+X" count for the rest.
 */
const MAX_CELLS = 12

function ScreenshotsSection() {
  const job = useJobDetails()
  const { open } = useModalStore()
  const closeModal = useCloseJobDetailsModal()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const screenshotsQuery = useQuery(
    forgeAPI.screenshots.list
      .input({ jobId: job.id, perPage: '100' })
      .queryOptions()
  )

  const items = screenshotsQuery.data?.items ?? []

  if (items.length === 0) return null

  const hasOverflow = items.length > MAX_CELLS
  const visible = items.slice(0, MAX_CELLS)
  const hiddenCount = items.length - visible.length

  function showAll() {
    const base = `/${pathname.split('/').filter(Boolean)[0] ?? ''}`

    closeModal()
    navigate(`${base}/gallery?jobId=${job.id}`)
  }

  return (
    <Section title="screenshots">
      <Grid
        gap="sm"
        p="md"
        templateCols={{ base: 3, sm: 4, md: 6 }}
        width="100%"
      >
        {visible.map((screenshot, index) => {
          const url = screenshotUrl(screenshot, SCREENSHOT_THUMB)
          const isOverflowTile =
            hasOverflow && index === visible.length - 1 && hiddenCount > 0

          return (
            <Card
              key={screenshot.id}
              isInteractive
              aspectRatio="1"
              overflow="hidden"
              p="none"
              position="relative"
              onClick={
                isOverflowTile
                  ? showAll
                  : () => open(ScreenshotViewerModal, { screenshot })
              }
            >
              {url ? (
                <img
                  alt={screenshot.filename}
                  src={url}
                  style={{
                    display: 'block',
                    height: '100%',
                    objectFit: 'cover',
                    width: '100%'
                  }}
                />
              ) : (
                <Icon color="muted" icon="tabler:photo-off" />
              )}
              {isOverflowTile && (
                <Flex
                  align="center"
                  bg={colorWithOpacity('bg-950', '60%')}
                  bottom="0"
                  justify="center"
                  left="0"
                  position="absolute"
                  right="0"
                  top="0"
                >
                  <Text color="bg-50" size="lg" weight="semibold">
                    +{hiddenCount}
                  </Text>
                </Flex>
              )}
            </Card>
          )
        })}
      </Grid>
    </Section>
  )
}

export default ScreenshotsSection
