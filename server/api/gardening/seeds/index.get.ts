import type { SeedCatalogRow } from '~/types/gardening'
import { createServerSupabaseClient, throwSupabaseError } from '../../../lib/apiSupabase'

export default defineEventHandler(async () => {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('garden_seeds')
    .select('*, garden_seed_sowing_windows(*)')
    .order('type', { ascending: true })
    .order('variety', { ascending: true })

  throwSupabaseError(error, 'Seed catalog could not be loaded.')

  return (data ?? []) as SeedCatalogRow[]
})
