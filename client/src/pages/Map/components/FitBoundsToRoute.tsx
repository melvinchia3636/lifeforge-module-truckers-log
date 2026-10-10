import type * as GeoJSON from 'geojson'
import type { Map as MapLibreMap } from 'maplibre-gl'
import { useEffect } from 'react'

export const FitBoundsToRoute = (props: {
  map: MapLibreMap | null
  route: GeoJSON.FeatureCollection
}) => {
  useEffect(() => {
    const map = props.map

    if (!map || props.route.features.length === 0) return
    let minLon = Infinity
    let minLat = Infinity
    let maxLon = -Infinity
    let maxLat = -Infinity

    for (const feature of props.route.features) {
      const g = feature.geometry
      const coords: number[][] =
        g.type === 'LineString'
          ? g.coordinates
          : g.type === 'Point'
            ? [g.coordinates]
            : []

      for (const c of coords) {
        const lon = c[0] ?? 0
        const lat = c[1] ?? 0
        minLon = Math.min(minLon, lon)
        minLat = Math.min(minLat, lat)
        maxLon = Math.max(maxLon, lon)
        maxLat = Math.max(maxLat, lat)
      }
    }

    if (Number.isFinite(minLon)) {
      map.fitBounds(
        [
          [minLon, minLat],
          [maxLon, maxLat]
        ],
        { padding: 60, duration: 0, maxZoom: 9 }
      )
    }
  }, [props.map, props.route])

  return null
}
