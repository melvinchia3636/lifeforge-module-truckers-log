import { useQuery } from '@tanstack/react-query'

import {
  EmptyStateScreen,
  Grid,
  ModuleHeader,
  Pagination,
  Scrollbar,
  Stack,
  WithQuery
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import JobItem from '@/pages/LogBook/components/JobItem'

import ScreenshotCard from './components/ScreenshotCard'
import useFilter from './hooks/useFilter'

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
        {jobQuery.data && (
          <JobItem job={jobQuery.data} showDetails={false} />
        )}
        <WithQuery query={screenshotsQuery}>
          {data =>
            data.items.length > 0 ? (
              <>
                <Pagination
                  page={data.page}
                  totalPages={data.totalPages}
                  onPageChange={newPage => updateFilter('page', newPage)}
                />
                <Scrollbar>
                  <Grid
                    gap="md"
                    pb="md"
                    templateCols={{ base: 1, sm: 2, md: 3, lg: 4 }}
                  >
                    {data.items.map(screenshot => (
                      <ScreenshotCard
                        key={screenshot.id}
                        screenshot={screenshot}
                      />
                    ))}
                  </Grid>
                </Scrollbar>
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
