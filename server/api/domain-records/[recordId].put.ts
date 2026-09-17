import type { DomainTableRecord } from '~/types/domain-table'
import { assertAllowedDomainTable, createServerSupabaseClient, throwSupabaseError } from '../../lib/apiSupabase'

export default defineEventHandler(async (event) => {
  const recordId = getRouterParam(event, 'recordId')
  const body = await readBody<{
    payload?: Record<string, unknown>
    tableName?: string
  }>(event)

  if (!recordId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Record ID is required.'
    })
  }

  if (!body.tableName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Table name is required.'
    })
  }

  assertAllowedDomainTable(body.tableName)

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from(body.tableName as never)
    .update((body.payload ?? {}) as never)
    .eq('id', recordId as never)
    .select()
    .single()

  throwSupabaseError(error, 'Record could not be updated.')

  return data as DomainTableRecord
})
