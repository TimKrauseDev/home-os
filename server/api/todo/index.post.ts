import type { TodoItem } from '~/types/todo'

export default defineEventHandler(async (event) => {
  const todo = await readValidatedBody(event, body => todoCreateSchema.parse(body))
  const supabase = useServerSupabase()
  const { data, error } = await supabase
    .from('todo')
    .insert(todo)
    .select('*')
    .single()

  throwTodoDatabaseError(error, 'Todo could not be created.')
  event.node.res.statusCode = 201

  return data as TodoItem
})
