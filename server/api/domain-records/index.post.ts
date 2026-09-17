import type { DomainTableRecord } from '~/types/domain-table'
import { assertAllowedDomainTable, createServerSupabaseClient, throwSupabaseError } from '../../lib/apiSupabase'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    payload?: Record<string, unknown>
    tableName?: string
  }>(event)

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
    .insert((body.payload ?? {}) as never)
    .select()
    .single()

  throwSupabaseError(error, 'Record could not be added.')
  setResponseStatus(event, 201)

  return data as DomainTableRecord
})
