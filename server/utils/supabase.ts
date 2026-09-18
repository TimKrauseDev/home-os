import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabase: SupabaseClient | null = null

export const useServerSupabase = () => {
  if (supabase) return supabase

  const config = useRuntimeConfig()
  const supabaseUrl = config.supabaseUrl
  const supabaseKey = config.supabaseServiceRoleKey || config.supabasePublishableKey

  if (!supabaseUrl || !supabaseKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase server configuration is missing.'
    })
  }

  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  return supabase
}

export const throwTodoDatabaseError = (
  error: { message: string } | null,
  fallbackMessage: string
) => {
  if (!error) return

  throw createError({
    statusCode: 500,
    statusMessage: error.message || fallbackMessage
  })
}
