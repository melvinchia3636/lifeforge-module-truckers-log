import { useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import { Button, ConfirmationModal, useModalStore } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

function RotateTokenButton({
  hasToken,
  onGenerated
}: {
  hasToken: boolean
  onGenerated: (token: string) => void
}) {
  const { t } = useModuleTranslation()
  const { open } = useModalStore()

  const rotateMutation = useForgeMutation(forgeAPI.settings.rotate, {
    action: 'update',
    queryKey: forgeAPI.settings.key
  })

  async function handleRotate() {
    const result = await rotateMutation.mutateAsync(undefined)

    onGenerated(result.token)
  }

  function handleRotateClick() {
    open(ConfirmationModal, {
      title: t('modals.ingestToken.rotateConfirm.title'),
      description: t('modals.ingestToken.rotateConfirm.description'),
      confirmationButton: {
        children: t('buttons.rotateToken'),
        icon: 'tabler:refresh'
      },
      onConfirm: handleRotate
    })
  }

  return (
    <Button
      icon="tabler:refresh"
      loading={rotateMutation.isPending}
      namespace={false}
      width="100%"
      onClick={hasToken ? handleRotateClick : handleRotate}
    >
      {t(hasToken ? 'buttons.rotateToken' : 'buttons.generateToken')}
    </Button>
  )
}

export default RotateTokenButton
