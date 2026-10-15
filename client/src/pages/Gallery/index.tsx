import { useQuery } from '@tanstack/react-query'

import type { InferOutput } from '@lifeforge/api'
import {
  EmptyStateScreen,
  ModuleHeader,
  Pagination,
  Stack,
  WithQuery
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import JobItem from '@/pages/LogBook/components/JobItem'

import ScreenshotGallery from './components/ScreenshotGallery'
import useFilter from './hooks/useFilter'

export type Screenshot = InferOutput<typeof forgeAPI.screenshots.get>

function Gallery() {
  const { page, jobId, updateFilter } = useFilter()

  const jobQuery = useQuery({
    ...forgeAPI.jobs.get.input({ id: jobId }).queryOptions(),
    enabled: Boolean(jobId)
  })

  const screenshotsQuery = useQuery(
    forgeAPI.screenshots.list
      .input({ page: String(page), jobId: jobId || undefined })
      .queryOptions()
  )

  return (
    <>
      <ModuleHeader icon="tabler:photo" title="gallery" />
      <Stack gap="md" height="100%" mb="lg" width="100%">
        {jobQuery.data && <JobItem job={jobQuery.data} showDetails={false} />}
        <WithQuery query={screenshotsQuery}>
          {data =>
            data.items.length > 0 ? (
              <>
                <Pagination
                  page={data.page}
                  totalPages={data.totalPages}
                  onPageChange={newPage => updateFilter('page', newPage)}
                />
                <ScreenshotGallery screenshots={data.items} />
              </>
            ) : (
              <EmptyStateScreen
                icon="tabler:photo-off"
                message={{ id: 'gallery' }}
              />
            )
          }
        </WithQuery>
      </Stack>
    </>
  )
}

export default Gallery
