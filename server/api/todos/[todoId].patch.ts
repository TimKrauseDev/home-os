import type { TodoItem } from '~/types/todo'

export default defineEventHandler(async (event) => {
  const todoId = requireTodoId(event)
  const updates = await readValidatedBody(event, body => todoUpdateSchema.parse(body))
  const supabase = useServerSupabase()

  const { data, error } = await supabase
    .from('todos')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', todoId)
    .select('*')
    .maybeSingle()

  throwTodoDatabaseError(error, 'Todo could not be updated.')

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Todo not found.'
    })
  }

  return data as TodoItem
})
