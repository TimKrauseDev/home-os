import type { GardenSeedTaskRow, SeedCatalogRow } from '~/types/gardening'
import { createServerSupabaseClient, throwSupabaseError } from '../../lib/apiSupabase'

export default defineEventHandler(async () => {
  const supabase = createServerSupabaseClient()
  const [tasksResponse, seedsResponse] = await Promise.all([
    supabase
      .from('garden_seed_tasks')
      .select('*, garden_seeds(id, type, variety, location_number, recommended_sow_method, source_image_url, source_page_url)')
      .order('due_date', { ascending: true })
      .limit(100),
    supabase
      .from('garden_seeds')
      .select('*, garden_seed_sowing_windows(*)')
      .order('type', { ascending: true })
      .order('variety', { ascending: true })
  ])

  throwSupabaseError(tasksResponse.error, 'Gardening tasks could not be loaded.')
  throwSupabaseError(seedsResponse.error, 'Gardening seeds could not be loaded.')

  return {
    tasks: (tasksResponse.data ?? []) as GardenSeedTaskRow[],
    seeds: (seedsResponse.data ?? []) as SeedCatalogRow[]
  }
})
