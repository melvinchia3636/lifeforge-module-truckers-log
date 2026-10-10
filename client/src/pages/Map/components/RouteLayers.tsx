import type * as GeoJSON from 'geojson'
import { Layer, Source } from 'react-map-gl/maplibre'

export function RouteLayers(props: {
  route: GeoJSON.FeatureCollection
  color: string
}) {
  return (
    <Source data={props.route} id={'record-route'} type={'geojson'}>
      <Layer
        filter={[
          'all',
          ['==', ['geometry-type'], 'LineString'],
          ['!=', ['get', 'kind'], 'transit']
        ]}
        id={'record-route-line'}
        layout={{ 'line-cap': 'round', 'line-join': 'round' }}
        paint={{
          'line-color': props.color,
          'line-width': 4,
          'line-opacity': 0.95
        }}
        type={'line'}
      />
      <Layer
        filter={[
          'all',
          ['==', ['geometry-type'], 'LineString'],
          ['==', ['get', 'kind'], 'transit']
        ]}
        id={'record-transit-line'}
        layout={{ 'line-cap': 'butt', 'line-join': 'round' }}
        paint={{
          'line-color': props.color,
          'line-width': 2.5,
          'line-opacity': 0.9,
          'line-dasharray': [2, 2]
        }}
        type={'line'}
      />
    </Source>
  )
}
