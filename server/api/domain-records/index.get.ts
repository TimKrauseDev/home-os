import type { DomainTableOrder, DomainTableRecord } from '~/types/domain-table'
import { assertAllowedDomainTable, createServerSupabaseClient, throwSupabaseError } from '../../lib/apiSupabase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const tableName = String(query.tableName ?? '')
  const select = String(query.select ?? '*')
  const orderColumn = String(query.orderColumn ?? 'created_at')
  const orderAscending = String(query.orderAscending ?? 'false') === 'true'

  assertAllowedDomainTable(tableName)

  const filters = Array.isArray(query.filters)
    ? query.filters
    : query.filters
      ? [query.filters]
      : []

  const supabase = createServerSupabaseClient()
  let request = supabase
    .from(tableName as never)
    .select(select)

  for (const rawFilter of filters) {
    const filter = JSON.parse(String(rawFilter)) as { column: string, value: string | number | boolean }
    request = request.eq(filter.column, filter.value as never)
  }

  const order: DomainTableOrder = {
    column: orderColumn,
    ascending: orderAscending
  }
  const { data, error } = await request.order(order.column, { ascending: order.ascending ?? false })

  throwSupabaseError(error, 'Records could not be loaded.')

  return (data ?? []) as DomainTableRecord[]
})
