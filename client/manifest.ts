import { lazy } from 'react'

import { createForgeModule } from '@lifeforge/federation'

import contract from './contract'

const { forgeAPI, ...manifest } = createForgeModule({
  subsection: [
    { label: 'Dashboard', icon: 'tabler:layout-dashboard', path: '' },
    { label: 'Log Book', icon: 'tabler:book', path: 'log-book' },
    { label: 'Map', icon: 'tabler:map', path: 'map' }
  ],
  routes: {
    '/': lazy(() => import('@/pages/Dashboard')),
    '/log-book': lazy(() => import('@/pages/LogBook')),
    '/map': lazy(() => import('@/pages/Map'))
  },
  contract
})

export default manifest

export { forgeAPI }
