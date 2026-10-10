/** Max plausible odometer increase between samples; larger jumps are glitches. */
const MAX_ODO_STEP_KM = 1

/** Fuel/adblue readings jitter; drops smaller than this are treated as noise (L). */
const FUEL_NOISE_L = 2

export interface JobSample {
  t_ms: number
  speed_kmh: number
  fuel_l: number
  adblue_l: number
  odometer_km: number
  engine_on: boolean
}

export interface JobStats {
  sample_count: number
  distance_km: number | null
  max_speed_kmh: number | null
  avg_speed_kmh: number | null
  fuel_used_l: number
  adblue_used_l: number
  idle_min: number
}

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals

  return Math.round(value * factor) / factor
}

/**
 * Estimates total draw-down of a tank (fuel/adblue) from its level samples.
 *
 * Readings are jittery and a level of 0 is a sentinel for "not available", so we
 * walk the series tracking an accepted level and only bank a drop once it clears
 * the noise band. Upward jumps (refuels) reset the level without counting.
 */
function robustDrop(values: number[]): number {
  let level: number | null = null

  let used = 0

  for (const value of values) {
    if (value <= 0) continue

    if (level === null) {
      level = value

      continue
    }

    if (level - value > FUEL_NOISE_L) {
      used += level - value
      level = value
    } else if (value - level > FUEL_NOISE_L) {
      level = value
    }
  }

  return used
}

/**
 * Derives a job's aggregate stats from its telemetry samples. Runs at read time
 * so the aggregates live in a single place (the samples) rather than being
 * duplicated as stored columns. `rows` must be ordered by `t_ms` ascending.
 */
export function computeJobStats(rows: JobSample[]): JobStats {
  const first = rows[0]

  if (!first) {
    return {
      sample_count: 0,
      distance_km: null,
      max_speed_kmh: null,
      avg_speed_kmh: null,
      fuel_used_l: 0,
      adblue_used_l: 0,
      idle_min: 0
    }
  }

  let maxSpeed = 0

  let distance = 0

  let idleMs = 0

  let speedSum = 0

  let speedCount = 0

  let prevOdometer: number | null = null

  let prev = first

  for (const s of rows) {
    maxSpeed = Math.max(maxSpeed, s.speed_kmh)

    // The in-game clock is heavily time-compressed, so distance / elapsed time is
    // meaningless. Average speed is the mean of the sample speeds while moving.
    if (s.speed_kmh > 1) {
      speedSum += s.speed_kmh
      speedCount += 1
    }

    // Only accumulate plausible deltas so transient telemetry glitches
    // (zeroed or spiked odometer readings) don't inflate the distance.
    if (s.odometer_km > 0) {
      if (prevOdometer === null) {
        prevOdometer = s.odometer_km
      } else {
        const delta = s.odometer_km - prevOdometer

        if (delta >= 0 && delta <= MAX_ODO_STEP_KM) {
          distance += delta
          prevOdometer = s.odometer_km
        }
      }
    }

    const dt = Math.min(s.t_ms - prev.t_ms, 5000)

    if (prev.engine_on && prev.speed_kmh < 1) idleMs += Math.max(0, dt)
    prev = s
  }

  const fuelUsed = robustDrop(rows.map(row => row.fuel_l))

  const adblueUsed = robustDrop(rows.map(row => row.adblue_l))

  const avgSpeed = speedCount > 0 ? speedSum / speedCount : null

  return {
    sample_count: rows.length,
    distance_km: round(distance, 2),
    max_speed_kmh: round(maxSpeed, 1),
    avg_speed_kmh: avgSpeed === null ? null : round(avgSpeed, 1),
    fuel_used_l: round(fuelUsed, 2),
    adblue_used_l: round(adblueUsed, 3),
    idle_min: round(idleMs / 60000, 2)
  }
}
