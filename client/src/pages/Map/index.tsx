import { useQuery } from '@tanstack/react-query'
import type * as GeoJSON from 'geojson'
import { useState } from 'react'

import {
  ContextMenu,
  ContextMenuItem,
  ModuleHeader,
  WithQuery
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import { RouteMap } from './components/RouteMap'
import useFilter from './hooks/useFilter'

const NAMESPACE = 'apps.melvinchia3636--truckers-log'

const AUTO_REFRESH_MS = 15_000

function Map() {
  const { id: jobId } = useFilter()
  const [autoRefresh, setAutoRefresh] = useState(false)

  const jobQuery = useQuery({
    ...forgeAPI.jobs.get.input({ id: jobId }).queryOptions(),
    enabled: Boolean(jobId)
  })

  const job = jobQuery.data

  const refetchInterval = autoRefresh ? AUTO_REFRESH_MS : false

  const routeQuery = useQuery({
    ...forgeAPI.sessions.route
      .input({
        sessionId: job?.session_id ?? '',
        from: job?.started_at ?? '',
        to: job?.finished_at ?? undefined
      })
      .queryOptions(),
    enabled: Boolean(job?.session_id),
    refetchInterval
  })

  return (
    <>
      <ModuleHeader
        icon="tabler:map"
        title="map"
        trailing={
          jobId ? (
            <ContextMenu>
              <ContextMenuItem
                checked={autoRefresh}
                icon="tabler:refresh"
                label="autoRefresh"
                namespace={NAMESPACE}
                shouldCloseMenuOnClick={false}
                onClick={() => setAutoRefresh(value => !value)}
              />
            </ContextMenu>
          ) : undefined
        }
      />
      {jobId ? (
        <WithQuery query={jobQuery}>
          {job =>
            job.session_id ? (
              <WithQuery key={job.id} query={routeQuery}>
                {route => (
                  <RouteMap
                    route={route as GeoJSON.FeatureCollection}
                    screenshotJobId={jobId}
                    screenshotRefetchInterval={refetchInterval}
                  />
                )}
              </WithQuery>
            ) : (
              <RouteMap
                screenshotJobId={jobId}
                screenshotRefetchInterval={refetchInterval}
              />
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
