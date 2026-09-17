import type { Enums, Tables, TablesInsert, TablesUpdate } from '../../database/database.types'

export type GardenSeed = Tables<'garden_seeds'>
export type SowingWindow = Tables<'garden_seed_sowing_windows'>
export type SeedCatalogRow = GardenSeed & {
  garden_seed_sowing_windows: SowingWindow[]
}

export type SeedInsert = TablesInsert<'garden_seeds'>
export type SeedUpdate = TablesUpdate<'garden_seeds'>
export type SowingWindowInsert = TablesInsert<'garden_seed_sowing_windows'>

export type SowMethod = Enums<'garden_sow_method'>
export type SowReference = Enums<'garden_sow_reference'>
export type SowDirection = Enums<'garden_sow_direction'>
export type SunType = Enums<'garden_sun_type'>
export type SeedDepth = Enums<'garden_seed_depth_inches'>
export type GardenSeedTaskStatus = Enums<'garden_seed_task_status'>

export type GardenSeedTaskSeed = Pick<
  GardenSeed,
  'id' | 'location_number' | 'recommended_sow_method' | 'source_image_url' | 'source_page_url' | 'type' | 'variety'
>
export type GardenSeedTaskSeedOption = Pick<GardenSeed, 'id' | 'location_number' | 'type' | 'variety'>
export type GardenSeedTask = Tables<'garden_seed_tasks'>
export type GardenSeedTaskRow = GardenSeedTask & {
  garden_seeds: GardenSeedTaskSeed | null
}
export type GardenSeedTaskInsert = TablesInsert<'garden_seed_tasks'>
export type GardenSeedTaskUpdate = TablesUpdate<'garden_seed_tasks'>

export type NewSowingWindow = {
  sow_method: SowMethod
  sow_reference: SowReference
  sow_direction: SowDirection
  sow_start_weeks: number
  sow_end_weeks: number
  notes: string
}

export type SeedForm = {
  location_number: string
  type: string
  variety: string
  recommended_sow_method: SowMethod | null
  is_succession_planted: boolean
  succession_interval_days: number | null
  days_to_emerge: number | null
  days_to_maturity: number | null
  seed_depth_inches: SeedDepth | null
  row_spacing_inches: number | null
  is_deer_resistant: boolean
  sun_type: SunType
  purchased_from: string
  source_page_url: string
  source_image_url: string
  overall_rating: number | null
  notes: string
}

export type GardenSeedTaskForm = {
  seed_id: string
  title: string
  due_date: string
  status: GardenSeedTaskStatus
  notes: string
}
