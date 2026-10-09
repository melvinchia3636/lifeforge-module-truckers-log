import { createInsertSchema } from 'drizzle-orm/zod'
import z from 'zod'

import {
  ets2RecordEvents,
  ets2RecordJobs,
  ets2RecordSamples,
  ets2RecordSessions
} from '../schema.drizzle'

const truckMetaSchema = createInsertSchema(ets2RecordSessions).pick({
  game: true,
  truck_id: true,
  truck_name: true,
  truck_brand: true,
  truck_plate: true
})

/** A single telemetry frame: a sample row plus the owning session's metadata. */
export const frameSchema = createInsertSchema(ets2RecordSamples)
  .omit({ id: true, session_id: true })
  .extend(truckMetaSchema.shape)

export const jobStartedSchema = createInsertSchema(ets2RecordJobs).pick({
  game: true,
  started_game_min: true,
  cargo: true,
  cargo_id: true,
  cargo_mass_kg: true,
  city_src: true,
  city_src_id: true,
  comp_src: true,
  comp_src_id: true,
  city_dst: true,
  city_dst_id: true,
  comp_dst: true,
  comp_dst_id: true,
  job_market: true,
  special_job: true,
  unit_count: true,
  unit_mass_kg: true,
  planned_distance_km: true,
  income: true,
  truck_id: true,
  truck_name: true,
  truck_brand: true,
  truck_plate: true
})

export const jobDeliveredSchema = createInsertSchema(ets2RecordJobs).pick({
  finished_game_min: true,
  delivered_distance_km: true,
  delivery_time_min: true,
  cargo_damage: true,
  revenue: true,
  xp: true,
  autopark: true,
  autoload: true
})

export const jobCancelledSchema = createInsertSchema(ets2RecordJobs).pick({
  finished_game_min: true,
  penalty: true
})

export const gameEventSchema = createInsertSchema(ets2RecordEvents).pick({
  kind: true,
  game_min: true,
  amount: true,
  detail: true
})

export const ingestMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('connected') }),
  z.object({ type: z.literal('disconnected') }),
  z.object({ type: z.literal('frame'), frame: frameSchema }),
  z.object({ type: z.literal('job-started'), job: jobStartedSchema }),
  z.object({ type: z.literal('job-delivered'), job: jobDeliveredSchema }),
  z.object({ type: z.literal('job-cancelled'), job: jobCancelledSchema }),
  z.object({ type: z.literal('game-event'), event: gameEventSchema })
])

export const ingestBodySchema = z.object({
  token: z.string(),
  clientId: z.string(),
  messages: z.array(ingestMessageSchema)
})

export type IngestMessage = z.infer<typeof ingestMessageSchema>

export type IngestFrame = z.infer<typeof frameSchema>
