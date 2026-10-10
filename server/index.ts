import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

import * as eventsRoutes from './routes/events'
import * as jobsRoutes from './routes/jobs'
import * as sessionsRoutes from './routes/sessions'
import * as settingsRoutes from './routes/settings'
import * as telemetryRoutes from './routes/telemetry'
import * as tilesRoutes from './routes/tiles'

const routes = forgeRouter({
  telemetry: telemetryRoutes,
  settings: settingsRoutes,
  sessions: sessionsRoutes,
  jobs: jobsRoutes,
  events: eventsRoutes,
  tiles: tilesRoutes
})

writeContractFileToClient(routes, import.meta.dirname)

export default routes
