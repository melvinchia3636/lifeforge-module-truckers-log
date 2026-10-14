import dayjs from 'dayjs'

import { useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  Flex,
  Icon,
  Stack,
  Text,
  toast,
  useModalStore,
  usePersonalization
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import ScreenshotViewerModal from '@/pages/Gallery/components/ScreenshotViewerModal'
import {
  SCREENSHOT_THUMB,
  screenshotUrl,
  type Screenshot
} from '@/pages/Gallery/components/utils'

const NAMESPACE = 'apps.melvinchia3636--truckers-log'

function ScreenshotCard({ screenshot }: { screenshot: Screenshot }) {
  const { t } = useModuleTranslation()
  const { language } = usePersonalization()
  const { open } = useModalStore()

  const url = screenshotUrl(screenshot, SCREENSHOT_THUMB)

  const deleteMutation = useForgeMutation(forgeAPI.screenshots.remove, {
    action: 'delete',
    queryKey: forgeAPI.screenshots.list.key
  })

  async function handleDelete() {
    await deleteMutation.mutateAsync({ id: screenshot.id })

    toast.success(t('screenshots.deleted'))
  }

  function handleDeleteClick() {
    open(ConfirmationModal, {
      title: t('modals.deleteScreenshot.title'),
      description: t('modals.deleteScreenshot.description'),
      confirmationButton: 'delete',
      onConfirm: handleDelete
    })
  }

  const location =
    screenshot.x != null && screenshot.z != null
      ? `${screenshot.x.toFixed(0)}, ${screenshot.z.toFixed(0)}`
      : t('screenshots.noLocation')

  return (
    <Card
      isInteractive
      gap="sm"
      onClick={() => open(ScreenshotViewerModal, { screenshot })}
    >
      <Box aspectRatio="4/3" bg="bg-950" overflow="hidden" r="md" width="100%">
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
          <Flex centered height="100%" width="100%">
            <Icon color="muted" icon="tabler:photo-off" />
          </Flex>
        )}
      </Box>
      <Flex align="center" gap="sm" justify="between" minWidth="0" width="100%">
        <Stack gap="none" minWidth="0">
          <Text truncate size="sm" weight="medium">
            {dayjs(screenshot.captured_at)
              .locale(language)
              .format('D MMM YYYY, HH:mm')}
          </Text>
          <Text truncate color="muted" size="xs">
            {location}
          </Text>
        </Stack>
        <ContextMenu>
          <ContextMenuItem
            dangerous
            icon="tabler:trash"
            label="deleteScreenshot"
            namespace={NAMESPACE}
            onClick={handleDeleteClick}
          />
        </ContextMenu>
      </Flex>
    </Card>
  )
}

export default ScreenshotCard
