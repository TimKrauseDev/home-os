import { createClient } from '@supabase/supabase-js/dist/module/index.js'

type SupabaseApiResponse<TData = Record<string, unknown> | Record<string, unknown>[]> = {
  data: TData | null
  error: { message: string } | null
}

type SupabaseApiQuery<TData = Record<string, unknown> | Record<string, unknown>[]> = PromiseLike<SupabaseApiResponse<TData>> & {
  delete: () => SupabaseApiQuery<TData>
  eq: (column: string, value: unknown) => SupabaseApiQuery<TData>
  insert: (values: unknown) => SupabaseApiQuery<TData>
  limit: (count: number) => SupabaseApiQuery<TData>
  order: (column: string, options: { ascending: boolean }) => SupabaseApiQuery<TData>
  select: (columns?: string) => SupabaseApiQuery<TData>
  single: () => PromiseLike<SupabaseApiResponse<Record<string, unknown>>>
  update: (values: unknown) => SupabaseApiQuery<TData>
}

type ServerSupabaseClient = {
  from: (table: string) => SupabaseApiQuery
}

let serverSupabaseClient: ServerSupabaseClient | null = null

export const createServerSupabaseClient = () => {
  if (serverSupabaseClient) return serverSupabaseClient

  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl as string
  const supabasePublishableKey = config.public.supabasePublishableKey as string

  serverSupabaseClient = createClient(supabaseUrl, supabasePublishableKey) as unknown as ServerSupabaseClient

  return serverSupabaseClient
}

export const throwSupabaseError = (error: { message: string } | null, fallbackMessage: string) => {
  if (!error) return

  throw createError({
    statusCode: 502,
    statusMessage: error.message || fallbackMessage
  })
}

export const allowedDomainTables = new Set([
  'app_settings',
  'budget_accounts',
  'budget_categories',
  'budget_merchants',
  'budget_savings_buckets',
  'budget_settlement_tasks',
  'budget_transaction_imports',
  'budget_transactions',
  'dashboard_attention_items',
  'freelance_workflows',
  'home_improvement_projects',
  'home_improvement_todos',
  'home_maintenance_completions',
  'home_maintenance_tasks',
  'household_members',
  'notification_rules',
  'security_controls'
])

export const assertAllowedDomainTable = (tableName: string) => {
  if (allowedDomainTables.has(tableName)) return

  throw createError({
    statusCode: 400,
    statusMessage: 'Table is not available through this endpoint.'
  })
}
