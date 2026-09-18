import type { TodoItem } from '~/types/todo'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const completed = parseCompletedFilter(query.completed)
  const category = parseCategoryFilter(query.category)
  const supabase = useServerSupabase()

  let request = supabase
    .from('todos')
    .select('*')
    .order('completed', { ascending: true })
    .order('due_date', { ascending: true, nullsFirst: false })

  if (completed !== undefined) request = request.eq('completed', completed)
  if (category) request = request.eq('category', category)

  const { data, error } = await request

  throwTodoDatabaseError(error, 'Todos could not be loaded.')

  return (data ?? []) as TodoItem[]
})
