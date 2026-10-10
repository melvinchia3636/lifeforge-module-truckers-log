import type * as GeoJSON from 'geojson'
import { Layer, Source } from 'react-map-gl/maplibre'

export function RouteLayers(props: {
  route: GeoJSON.FeatureCollection
  color: string
}) {
  return (
    <Source data={props.route} id={'record-route'} type={'geojson'}>
      <Layer
        filter={['==', ['geometry-type'], 'LineString']}
        id={'record-route-line'}
        layout={{ 'line-cap': 'round', 'line-join': 'round' }}
        paint={{
          'line-color': props.color,
          'line-width': 4,
          'line-opacity': 0.95
        }}
        type={'line'}
      />
    </Source>
  )
}
