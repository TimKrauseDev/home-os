import type { SeedInsert, SowingWindowInsert } from '~/types/gardening'
import { createServerSupabaseClient, throwSupabaseError } from '../../../lib/apiSupabase'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    seed: SeedInsert
    sowingWindows?: Omit<SowingWindowInsert, 'seed_id'>[]
  }>(event)

  const supabase = createServerSupabaseClient()
  const { data: savedSeed, error: seedError } = await supabase
    .from('garden_seeds')
    .insert(body.seed)
    .select('id')
    .single()

  throwSupabaseError(seedError, 'Seed could not be added.')
  if (!savedSeed) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Seed was saved, but no row was returned.'
    })
  }

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

  setResponseStatus(event, 201)

  return savedSeed
})
