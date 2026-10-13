import { useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  toast,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import { useJobItemContext } from '../contexts/JobItemContext'

const NAMESPACE = 'apps.melvinchia3636--truckers-log'

function JobContextMenu() {
  const job = useJobItemContext()
  const { t } = useModuleTranslation()
  const { open } = useModalStore()

  const mergeMutation = useForgeMutation(forgeAPI.jobs.merge, {
    action: 'update',
    queryKey: [forgeAPI.jobs.list.key, forgeAPI.jobs.get.key]
  })

  if (job.status !== 'delivered' || job.mergeable_count <= 0) {
    return null
  }

  async function handleMerge() {
    const result = await mergeMutation.mutateAsync({ id: job.id })

    toast.success(t('modals.mergeJob.success', { count: result.merged }))
  }

  function handleClick() {
    open(ConfirmationModal, {
      title: t('modals.mergeJob.title'),
      description: t('modals.mergeJob.description', {
        count: job.mergeable_count
      }),
      confirmationButton: {
        children: 'buttons.mergePrevious',
        icon: 'tabler:git-merge',
        dangerous: true
      },
      onConfirm: handleMerge
    })
  }

  return (
    <ContextMenu
      componentProps={{
        menu: {
          minWidth: '20rem'
        }
      }}
    >
      <ContextMenuItem
        icon="tabler:git-merge"
        label="mergePrevious"
        namespace={NAMESPACE}
        onClick={handleClick}
      />
    </ContextMenu>
  )
}

export default JobContextMenu
