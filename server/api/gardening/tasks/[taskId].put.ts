import type { GardenSeedTaskUpdate } from '~/types/gardening'
import { createServerSupabaseClient, throwSupabaseError } from '../../../lib/apiSupabase'

export default defineEventHandler(async (event) => {
  const taskId = getRouterParam(event, 'taskId')
  const body = await readBody<GardenSeedTaskUpdate>(event)

  if (!taskId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Task ID is required.'
    })
  }

  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('garden_seed_tasks')
    .update(body)
    .eq('id', taskId)

  throwSupabaseError(error, 'Planting task could not be updated.')

  return { ok: true }
})
