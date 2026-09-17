import type { GardenSeedTaskRow } from '~/types/gardening'
import { createServerSupabaseClient, throwSupabaseError } from '../../../lib/apiSupabase'

export default defineEventHandler(async () => {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('garden_seed_tasks')
    .select('*, garden_seeds(id, type, variety, location_number, recommended_sow_method, source_image_url, source_page_url)')
    .order('due_date', { ascending: true })
    .order('created_at', { ascending: true })

  throwSupabaseError(error, 'Planting tasks could not be loaded.')

  return (data ?? []) as GardenSeedTaskRow[]
})
