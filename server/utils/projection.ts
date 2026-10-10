import proj4 from 'proj4'

/**
 * ETS2 game-world coordinates -> WGS84 [lon, lat].
 *
 * Ported from TruckSim Maps (truckermudgeon/maps, GPL-3.0-or-later)
 * `libs/map/projections.ts`. The projection constants come from ETS2's
 * `def/climate.sii`.
 */
type Position = [number, number]

const earthRadiusMeters = 6_370_997

export const lengthOfDegree = (earthRadiusMeters * Math.PI) / 180

const ets2DefData = {
  mapProjection: 'lambert_conic',
  standardParalel1: 37,
  standardParalel2: 65,
  mapOrigin: [50, 15],
  mapOffset: [16660, 4150],
  mapFactor: [-0.000171570875, 0.0001729241463]
} as const

const ets2 = [
  '+proj=lcc',
  `+R=${earthRadiusMeters}`,
  `+lat_1=${ets2DefData.standardParalel1}`,
  `+lat_2=${ets2DefData.standardParalel2}`,
  `+lat_0=${ets2DefData.mapOrigin[0]}`,
  `+lon_0=${ets2DefData.mapOrigin[1]}`
].join(' ')

const fromWgs84ToEts2Converter = proj4(ets2)

export function fromEts2CoordsToWgs84([x, y]: Position): Position {
  const sx = Math.floor(x / 4000)

  const sy = Math.floor(y / 4000)

  // apply mapOffset to coords before projecting.
  x -= ets2DefData.mapOffset[0]
  y -= ets2DefData.mapOffset[1]

  // UK content is authored at a slightly larger scale (~14.37 vs. ~19.15).
  const ukScaleFactor = 0.75

  const calais: [number, number] = [-31100, -5500]

  const isUk = sx <= -8 && sy <= -2 && !(sx === -8 && sy === -2)

  if (isUk) {
    x = (x + calais[0] / 2) * ukScaleFactor
    y = (y + calais[1] / 2) * ukScaleFactor
  }

  const lccCoords: Position = [
    x * ets2DefData.mapFactor[1] * lengthOfDegree,
    y * ets2DefData.mapFactor[0] * lengthOfDegree
  ]

  return fromWgs84ToEts2Converter.inverse(lccCoords)
}