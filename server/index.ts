import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

import * as eventsRoutes from './routes/events'
import * as jobsRoutes from './routes/jobs'
import * as samplesRoutes from './routes/samples'
import * as sessionsRoutes from './routes/sessions'
import * as settingsRoutes from './routes/settings'
import * as telemetryRoutes from './routes/telemetry'

const routes = forgeRouter({
  telemetry: telemetryRoutes,
  settings: settingsRoutes,
  sessions: sessionsRoutes,
  jobs: jobsRoutes,
  events: eventsRoutes,
  samples: samplesRoutes
})

writeContractFileToClient(routes, import.meta.dirname)

export default routes
