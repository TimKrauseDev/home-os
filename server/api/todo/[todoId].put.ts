import type { TodoItem } from '~/types/todo'

export default defineEventHandler(async (event) => {
  const todoId = requireTodoId(event)
  const todo = await readValidatedBody(event, body => todoReplaceSchema.parse(body))
  const supabase = useServerSupabase()

  const { data, error } = await supabase
    .from('todo')
    .update({
      ...todo,
      updated_at: new Date().toISOString()
    })
    .eq('id', todoId)
    .select('*')
    .maybeSingle()

  throwTodoDatabaseError(error, 'Todo could not be replaced.')

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Todo not found.'
    })
  }

  return data as TodoItem
})
