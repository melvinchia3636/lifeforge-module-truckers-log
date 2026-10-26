import { useQuery } from '@tanstack/react-query'

import { type InferOutput, useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  EmptyStateScreen,
  ModuleHeader,
  Pagination,
  Scrollbar,
  Stack,
  WithQuery,
  toast,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import JobItem from './components/JobItem'
import useFilter from './hooks/useFilter'

export type Job = InferOutput<typeof forgeAPI.jobs.get>

const NAMESPACE = 'apps.melvinchia3636--truckers-log'

function LogBook() {
  const { t } = useModuleTranslation()
  const { open } = useModalStore()
  const { page, updateFilter } = useFilter()

  const jobsQuery = useQuery(
    forgeAPI.jobs.list.input({ page: String(page) }).queryOptions()
  )

  const interruptedQuery = useQuery(
    forgeAPI.jobs.list
      .input({ status: 'interrupted', perPage: '1' })
      .queryOptions()
  )

  const interruptedCount = interruptedQuery.data?.totalItems ?? 0

  const clearMutation = useForgeMutation(forgeAPI.jobs.clearInterrupted, {
    action: 'delete',
    queryKey: [
      forgeAPI.jobs.list.key,
      forgeAPI.jobs.get.key,
      forgeAPI.screenshots.list.key
    ]
  })

  async function handleClear() {
    const result = await clearMutation.mutateAsync(undefined)

    toast.success(
      t('modals.clearInterrupted.success', { count: result.cleared })
    )
  }

  function handleClearClick() {
    open(ConfirmationModal, {
      title: t('modals.clearInterrupted.title'),
      description: t('modals.clearInterrupted.description', {
        count: interruptedCount
      }),
      confirmationButton: {
        children: 'buttons.clearInterrupted',
        icon: 'tabler:trash',
        namespace: NAMESPACE,
        tProps: { count: interruptedCount },
        dangerous: true
      },
      onConfirm: handleClear
    })
  }

  return (
    <>
      <ModuleHeader
        icon="tabler:book"
        title="Log Book"
        trailing={
          <ContextMenu>
            <ContextMenuItem
              dangerous
              disabled={interruptedCount === 0}
              icon="tabler:trash"
              label="clearInterrupted"
              namespace={NAMESPACE}
              tProps={{ count: interruptedCount }}
              onClick={handleClearClick}
            />
          </ContextMenu>
        }
      />
      <Stack minHeight="0">
        <WithQuery query={jobsQuery}>
          {data =>
            data.items.length > 0 ? (
              <>
                <Pagination
                  page={data.page}
                  totalPages={data.totalPages}
                  onPageChange={newPage => updateFilter('page', newPage)}
                />
                <Scrollbar>
                  <Stack gap="md">
                    {data.items.map(job => (
                      <JobItem key={job.id} job={job} />
                    ))}
                  </Stack>
                </Scrollbar>
              </>
            ) : (
              <EmptyStateScreen
                icon="tabler:truck-off"
                message={{ id: 'records' }}
              />
            )
          }
        </WithQuery>
      </Stack>
    </>
  )
}

export default LogBook
