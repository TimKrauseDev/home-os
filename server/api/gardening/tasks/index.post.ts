import type { GardenSeedTaskInsert } from '~/types/gardening'
import { createServerSupabaseClient, throwSupabaseError } from '../../../lib/apiSupabase'

export default defineEventHandler(async (event) => {
  const body = await readBody<GardenSeedTaskInsert>(event)
  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('garden_seed_tasks')
    .insert(body)

  throwSupabaseError(error, 'Planting task could not be added.')
  setResponseStatus(event, 201)

  return { ok: true }
})
