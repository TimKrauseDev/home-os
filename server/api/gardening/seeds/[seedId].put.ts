import type { SeedUpdate, SowingWindowInsert } from '~/types/gardening'
import { createServerSupabaseClient, throwSupabaseError } from '../../../lib/apiSupabase'

export default defineEventHandler(async (event) => {
  const seedId = getRouterParam(event, 'seedId')
  const body = await readBody<{
    seed: SeedUpdate
    sowingWindows?: Omit<SowingWindowInsert, 'seed_id'>[]
  }>(event)

  if (!seedId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Seed ID is required.'
    })
  }

  const supabase = createServerSupabaseClient()
  const { data: savedSeed, error: seedError } = await supabase
    .from('garden_seeds')
    .update(body.seed)
    .eq('id', seedId)
    .select('id')
    .single()

  throwSupabaseError(seedError, 'Seed could not be updated.')
  if (!savedSeed) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Seed was updated, but no row was returned.'
    })
  }

  const { error: deleteWindowsError } = await supabase
    .from('garden_seed_sowing_windows')
    .delete()
    .eq('seed_id', savedSeed.id)

  throwSupabaseError(deleteWindowsError, 'Existing sowing windows could not be replaced.')

  const sowingWindows = (body.sowingWindows ?? []).map(window => ({
    ...window,
    seed_id: savedSeed.id
  }))

  if (sowingWindows.length) {
    const { error } = await supabase
      .from('garden_seed_sowing_windows')
      .insert(sowingWindows)

    throwSupabaseError(error, 'Sowing windows could not be saved.')
  }

  return savedSeed
})
