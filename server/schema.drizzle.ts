import { type RelationsBuilder } from 'drizzle-orm'
import {
  bigint,
  boolean,
  doublePrecision,
  integer,
  pgEnum,
  text,
  timestamp,
  uuid,
  varchar
} from 'drizzle-orm/pg-core'

import { createModuleTable } from '@lifeforge/drizzle'

const pgTable = createModuleTable()

export const gameEnum = pgEnum('ets2_record_game', ['ets2', 'ats', 'unknown'])

export const sessionStatusEnum = pgEnum('ets2_record_session_status', [
  'active',
  'completed',
  'interrupted'
])

export const jobStatusEnum = pgEnum('ets2_record_job_status', [
  'active',
  'delivered',
  'cancelled',
  'interrupted'
])

export const eventKindEnum = pgEnum('ets2_record_event_kind', [
  'fine',
  'refuel',
  'tollgate',
  'ferry',
  'train'
])

export const ets2RecordSessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  client_id: text('client_id').notNull().default(''),
  game: gameEnum('game').notNull().default('unknown'),
  status: sessionStatusEnum('status').notNull().default('active'),
  started_at: timestamp('started_at', { mode: 'date' }).notNull(),
  started_game_min: doublePrecision('started_game_min'),
  finished_at: timestamp('finished_at', { mode: 'date' }),
  finished_game_min: doublePrecision('finished_game_min'),
  truck_id: text('truck_id').notNull().default(''),
  truck_name: text('truck_name').notNull().default(''),
  truck_brand: text('truck_brand').notNull().default(''),
  truck_plate: text('truck_plate').notNull().default(''),
  created: timestamp('created', { mode: 'date' }).defaultNow().notNull(),
  updated: timestamp('updated', { mode: 'date' }).defaultNow().notNull()
})

export const ets2RecordJobs = pgTable('jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  session_id: uuid('session_id').references(() => ets2RecordSessions.id),
  game: gameEnum('game').notNull().default('unknown'),
  status: jobStatusEnum('status').notNull().default('active'),
  started_at: timestamp('started_at', { mode: 'date' }).notNull(),
  started_game_min: doublePrecision('started_game_min'),
  finished_at: timestamp('finished_at', { mode: 'date' }),
  finished_game_min: doublePrecision('finished_game_min'),
  cargo: text('cargo').notNull().default(''),
  cargo_id: text('cargo_id').notNull().default(''),
  cargo_mass_kg: doublePrecision('cargo_mass_kg').notNull().default(0),
  city_src: text('city_src').notNull().default(''),
  city_src_id: text('city_src_id').notNull().default(''),
  comp_src: text('comp_src').notNull().default(''),
  comp_src_id: text('comp_src_id').notNull().default(''),
  city_dst: text('city_dst').notNull().default(''),
  city_dst_id: text('city_dst_id').notNull().default(''),
  comp_dst: text('comp_dst').notNull().default(''),
  comp_dst_id: text('comp_dst_id').notNull().default(''),
  job_market: text('job_market').notNull().default(''),
  special_job: boolean('special_job').notNull().default(false),
  unit_count: integer('unit_count').notNull().default(0),
  unit_mass_kg: doublePrecision('unit_mass_kg').notNull().default(0),
  planned_distance_km: doublePrecision('planned_distance_km'),
  delivered_distance_km: doublePrecision('delivered_distance_km'),
  distance_km: doublePrecision('distance_km'),
  revenue: integer('revenue').notNull().default(0),
  income: integer('income').notNull().default(0),
  penalty: integer('penalty').notNull().default(0),
  xp: integer('xp').notNull().default(0),
  cargo_damage: doublePrecision('cargo_damage').notNull().default(0),
  autopark: boolean('autopark').notNull().default(false),
  autoload: boolean('autoload').notNull().default(false),
  delivery_time_min: doublePrecision('delivery_time_min'),
  avg_speed_kmh: doublePrecision('avg_speed_kmh'),
  max_speed_kmh: doublePrecision('max_speed_kmh'),
  fuel_used_l: doublePrecision('fuel_used_l').notNull().default(0),
  adblue_used_l: doublePrecision('adblue_used_l').notNull().default(0),
  idle_min: doublePrecision('idle_min').notNull().default(0),
  sample_count: integer('sample_count').notNull().default(0),
  truck_id: text('truck_id').notNull().default(''),
  truck_name: text('truck_name').notNull().default(''),
  truck_brand: text('truck_brand').notNull().default(''),
  truck_plate: text('truck_plate').notNull().default(''),
  created: timestamp('created', { mode: 'date' }).defaultNow().notNull(),
  updated: timestamp('updated', { mode: 'date' }).defaultNow().notNull()
})

export const ets2RecordSamples = pgTable('samples', {
  id: uuid('id').defaultRandom().primaryKey(),
  session_id: uuid('session_id')
    .notNull()
    .references(() => ets2RecordSessions.id),
  t_ms: bigint('t_ms', { mode: 'number' }).notNull(),
  game_min: doublePrecision('game_min').notNull().default(0),
  speed_kmh: doublePrecision('speed_kmh').notNull().default(0),
  rpm: doublePrecision('rpm').notNull().default(0),
  gear: integer('gear').notNull().default(0),
  throttle: doublePrecision('throttle').notNull().default(0),
  brake: doublePrecision('brake').notNull().default(0),
  steer: doublePrecision('steer').notNull().default(0),
  clutch: doublePrecision('clutch').notNull().default(0),
  fuel_l: doublePrecision('fuel_l').notNull().default(0),
  adblue_l: doublePrecision('adblue_l').notNull().default(0),
  odometer_km: doublePrecision('odometer_km').notNull().default(0),
  cargo_damage: doublePrecision('cargo_damage').notNull().default(0),
  x: doublePrecision('x').notNull().default(0),
  y: doublePrecision('y').notNull().default(0),
  z: doublePrecision('z').notNull().default(0),
  heading_deg: doublePrecision('heading_deg').notNull().default(0),
  cruise_control: boolean('cruise_control').notNull().default(false),
  engine_on: boolean('engine_on').notNull().default(false),
  park_brake: boolean('park_brake').notNull().default(false)
})

export const ets2RecordEvents = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  session_id: uuid('session_id').references(() => ets2RecordSessions.id),
  job_id: uuid('job_id').references(() => ets2RecordJobs.id),
  kind: eventKindEnum('kind').notNull(),
  game_min: doublePrecision('game_min').notNull().default(0),
  amount: integer('amount').notNull().default(0),
  detail: text('detail').notNull().default(''),
  created: timestamp('created', { mode: 'date' }).defaultNow().notNull()
})

export const ets2RecordSettings = pgTable('settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  ingest_token_hash: varchar('ingest_token_hash', { length: 64 })
    .notNull()
    .default(''),
  ingest_token_last4: varchar('ingest_token_last4', { length: 8 })
    .notNull()
    .default(''),
  ingest_token_created: timestamp('ingest_token_created', { mode: 'date' }),
  created: timestamp('created', { mode: 'date' }).defaultNow().notNull(),
  updated: timestamp('updated', { mode: 'date' }).defaultNow().notNull()
})

export const tables = {
  sessions: ets2RecordSessions,
  jobs: ets2RecordJobs,
  samples: ets2RecordSamples,
  events: ets2RecordEvents,
  settings: ets2RecordSettings
}

export const relations = (r: RelationsBuilder<typeof tables>) => ({
  sessions: {
    jobs: r.many.jobs(),
    samples: r.many.samples(),
    events: r.many.events()
  },
  jobs: {
    session: r.one.sessions({
      from: r.jobs.session_id,
      to: r.sessions.id
    }),
    events: r.many.events()
  },
  samples: {
    session: r.one.sessions({
      from: r.samples.session_id,
      to: r.sessions.id
    })
  },
  events: {
    session: r.one.sessions({
      from: r.events.session_id,
      to: r.sessions.id
    }),
    job: r.one.jobs({
      from: r.events.job_id,
      to: r.jobs.id
    })
  }
})

export type Ets2RecordSchema = typeof tables
