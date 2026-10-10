import type * as GeoJSON from 'geojson';
import { Marker } from 'react-map-gl/maplibre';

import { Icon } from '@lifeforge/ui';

export function RouteMarkers(props: {
  route: GeoJSON.FeatureCollection;
}) {
  const points = props.route.features.filter(
    (feature): feature is GeoJSON.Feature<GeoJSON.Point> =>
      feature.geometry.type === 'Point',
  );

  return (
    <>
      {points.map((feature, index) => {
        const [lon = 0, lat = 0] = feature.geometry.coordinates;
        const color = (feature.properties?.color as string | undefined) ?? '#2563eb';
        const icon =
          index === 0 ? 'tabler:player-play-filled' : 'tabler:flag-2-filled';

        return (
          <Marker
            key={`${lon},${lat},${index}`}
            anchor="center"
            latitude={lat}
            longitude={lon}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 26,
                height: 26,
                borderRadius: '9999px',
                background: color,
                color: '#fff',
                border: '2px solid #fff',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.4)',
              }}
            >
              <Icon icon={icon} />
            </div>
          </Marker>
        );
      })}
    </>
  );
}
