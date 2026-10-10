import { useQuery } from '@tanstack/react-query'
import type * as GeoJSON from 'geojson'

import { ModuleHeader, WithQuery } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import { RouteMap } from './components/RouteMap'
import useFilter from './hooks/useFilter'

function Map() {
  const { id: jobId } = useFilter()

  const jobQuery = useQuery({
    ...forgeAPI.jobs.get.input({ id: jobId }).queryOptions(),
    enabled: Boolean(jobId)
  })

  const job = jobQuery.data

  const routeQuery = useQuery({
    ...forgeAPI.sessions.route
      .input({
        sessionId: job?.session_id ?? '',
        from: job?.started_at ?? '',
        to: job?.finished_at ?? undefined
      })
      .queryOptions(),
    enabled: Boolean(job?.session_id)
  })

  return (
    <>
      <ModuleHeader icon="tabler:map" title="map" />
      {jobId ? (
        <WithQuery query={jobQuery}>
          {job =>
            job.session_id ? (
              <WithQuery key={job.id} query={routeQuery}>
                {route => (
                  <RouteMap route={route as GeoJSON.FeatureCollection} />
                )}
              </WithQuery>
            ) : (
              <RouteMap />
            )
          }
        </WithQuery>
      ) : (
        <RouteMap />
      )}
    </>
  )
}

export default Map
