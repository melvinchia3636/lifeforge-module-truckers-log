import { useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  ConfirmationModal,
  ModalHeader,
  Stack,
  toast,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { Screenshot } from '../..'
import ScreenshotDetails from './components/ScreenshotDetails'
import ScreenshotPreview from './components/ScreenshotPreview'

const NAMESPACE = 'apps.melvinchia3636--truckers-log'

function ScreenshotViewerModal({
  data: { screenshot },
  onClose
}: {
  data: { screenshot: Screenshot }
  onClose: () => void
}) {
  const { t } = useModuleTranslation()
  const { open } = useModalStore()

  const deleteMutation = useForgeMutation(forgeAPI.screenshots.remove, {
    action: 'delete',
    queryKey: forgeAPI.screenshots.list.key
  })

  return (
    <Stack maxWidth="90vw" minWidth={{ base: 'unset', md: '50vw' }}>
      <ModalHeader
        icon="tabler:photo"
        namespace={NAMESPACE}
        title="screenshot"
        trailing={
          <Button
            dangerous
            icon="tabler:trash"
            variant="plain"
            onClick={() =>
              open(ConfirmationModal, {
                title: t('modals.deleteScreenshot.title'),
                description: t('modals.deleteScreenshot.description'),
                confirmationButton: 'delete',
                onConfirm: async () => {
                  await deleteMutation.mutateAsync({ id: screenshot.id })

                  toast.success(t('screenshots.deleted'))
                  onClose()
                }
              })
            }
          />
        }
        onClose={onClose}
      />
      <ScreenshotPreview screenshot={screenshot} />
      <ScreenshotDetails screenshot={screenshot} />
    </Stack>
  )
}

export default ScreenshotViewerModal
