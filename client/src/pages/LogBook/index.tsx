import { useQuery } from '@tanstack/react-query'

import { type InferOutput } from '@lifeforge/api'
import {
  EmptyStateScreen,
  ModuleHeader,
  Pagination,
  Scrollbar,
  Stack,
  WithQuery
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import JobItem from './components/JobItem'
import useFilter from './hooks/useFilter'

export type Job = InferOutput<typeof forgeAPI.jobs.get>

function LogBook() {
  const { page, updateFilter } = useFilter()

  const jobsQuery = useQuery(
    forgeAPI.jobs.list.input({ page: String(page) }).queryOptions()
  )

  return (
    <>
      <ModuleHeader icon="tabler:book" title="Log Book" />
      <Stack gap="md" height="100%" mb="lg" width="100%">
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
