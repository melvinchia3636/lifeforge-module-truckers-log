import { lazy } from 'react'

import { createForgeModule } from '@lifeforge/federation'

import type { Contract } from './contract'

const { forgeAPI, ...manifest } = createForgeModule<Contract>({
  subsection: [
    { label: 'Dashboard', icon: 'tabler:layout-dashboard', path: '' },
    { label: 'Log Book', icon: 'tabler:book', path: 'log-book' },
    { label: 'Gallery', icon: 'tabler:photo', path: 'gallery' },
    { label: 'Map', icon: 'tabler:map', path: 'map' }
  ],
  routes: {
    '/': lazy(() => import('@/pages/Dashboard')),
    '/log-book': lazy(() => import('@/pages/LogBook')),
    '/gallery': lazy(() => import('@/pages/Gallery')),
    '/map': lazy(() => import('@/pages/Map'))
  }
})

export default manifest

export { forgeAPI }
