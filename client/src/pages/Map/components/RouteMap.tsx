import type * as GeoJSON from 'geojson'
import type { Map as MapLibreMap } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useState } from 'react'
import MapGl, {
  AttributionControl,
  NavigationControl
} from 'react-map-gl/maplibre'

import { Box, usePersonalization } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import { BaseMapStyle, GameMapStyle } from '../../../lib/ui'
import { IconLoader } from './IconLoader'
import { FitBoundsToRoute } from './FitBoundsToRoute'
import { RouteLayers } from './RouteLayers'
import { RouteMarkers } from './RouteMarkers'
import './mapCorners.css'

export const mapStyleNoSprite = {
  version: 8 as const,
  glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
  sources: {},
  layers: []
}

export function RouteMap({
  route = {
    type: 'FeatureCollection',
    features: []
  }
}: {
  route?: GeoJSON.FeatureCollection
}) {
  const tileRootUrl = `${forgeAPI.tiles.get.endpoint}?file=`

  const { derivedTheme, derivedThemeColor } = usePersonalization()
  const [map, setMap] = useState<MapLibreMap | null>(null)

  return (
    <Box
      shadow
      flex="1"
      mb="lg"
      minHeight="70vh"
      overflow="hidden"
      position="relative"
      r="lg"
      style={{ clipPath: 'inset(0 round var(--radius-lg))' }}
      width="100%"
      zIndex="0"
    >
      <MapGl
        attributionControl={false}
        initialViewState={{ longitude: 10, latitude: 48, zoom: 5 }}
        mapStyle={mapStyleNoSprite}
        maxZoom={15}
        minZoom={4}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 'var(--radius-lg)',
          clipPath: 'inset(0 round var(--radius-lg))',
          overflow: 'hidden'
        }}
        onLoad={e => setMap(e.target)}
      >
        <BaseMapStyle mode={derivedTheme} tileRootUrl={tileRootUrl} />
        <GameMapStyle
          game={'ets2'}
          mode={derivedTheme}
          tileRootUrl={tileRootUrl}
        />
        <RouteLayers color={derivedThemeColor} route={route} />
        <RouteMarkers route={route} />
        <IconLoader map={map} />
        <FitBoundsToRoute map={map} route={route} />
        <NavigationControl visualizePitch={true} />
        <AttributionControl
          compact={true}
          customAttribution="&copy; Trucker Mudgeon / SCS Software"
        />
      </MapGl>
    </Box>
  )
}
