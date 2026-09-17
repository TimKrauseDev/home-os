import type { GardenSeedTaskSeed } from '~/types/gardening'
import { createServerSupabaseClient, throwSupabaseError } from '../../../lib/apiSupabase'

export default defineEventHandler(async () => {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('garden_seeds')
    .select('id, type, variety, location_number, recommended_sow_method, source_image_url, source_page_url')
    .order('type', { ascending: true })
    .order('variety', { ascending: true })

  throwSupabaseError(error, 'Seed options could not be loaded.')

  return (data ?? []) as GardenSeedTaskSeed[]
})
