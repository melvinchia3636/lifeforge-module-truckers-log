import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router'

import {
  Card,
  Flex,
  Grid,
  Image,
  Text,
  colorWithOpacity,
  surface,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import ScreenshotViewerModal from '@/pages/Gallery/components/ScreenshotViewerModal'

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
          const isOverflowTile =
            hasOverflow && index === visible.length - 1 && hiddenCount > 0

          return (
            <Card
              key={screenshot.id}
              isInteractive
              aspectRatio="1"
              bg={surface.light}
              overflow="hidden"
              p="none"
              position="relative"
              style={{ isolation: 'isolate' }}
              onClick={
                isOverflowTile
                  ? showAll
                  : () => open(ScreenshotViewerModal, { screenshot })
              }
            >
              <Image
                alt=""
                fallback="tabler:photo"
                fit="cover"
                height="100%"
                src={forgeAPI.getMedia({
                  key: screenshot.file_key,
                  thumb: '400x0'
                })}
                width="100%"
              />
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
