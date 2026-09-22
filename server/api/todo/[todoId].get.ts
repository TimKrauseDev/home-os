import type { TodoItem } from '~/types/todo'

export default defineEventHandler(async (event) => {
  const todoId = requireTodoId(event)
  const supabase = useServerSupabase()
  const { data, error } = await supabase
    .from('todo')
    .select('*')
    .eq('id', todoId)
    .maybeSingle()

  throwTodoDatabaseError(error, 'Todo could not be loaded.')

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Todo not found.'
    })
  }

  return data as TodoItem
})
