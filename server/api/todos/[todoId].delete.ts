export default defineEventHandler(async (event) => {
  const todoId = requireTodoId(event)
  const supabase = useServerSupabase()
  const { data, error } = await supabase
    .from('todos')
    .delete()
    .eq('id', todoId)
    .select('id')
    .maybeSingle()

  throwTodoDatabaseError(error, 'Todo could not be deleted.')

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Todo not found.'
    })
  }

  return sendNoContent(event)
})
