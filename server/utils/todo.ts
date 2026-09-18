import { z } from 'zod'

export const todoCategories = [
  'Cleaning',
  'Errands',
  'Finance',
  'Garden',
  'General',
  'Home',
  'Maintenance',
  'Shopping'
] as const

export const todoCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  category: z.enum(todoCategories).default('General'),
  due_date: z.string().trim().min(1).nullable().default(null),
  completed: z.boolean().default(false)
})

export const todoUpdateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  category: z.enum(todoCategories).optional(),
  due_date: z.string().trim().min(1).nullable().optional(),
  completed: z.boolean().optional()
})
  .refine(value => Object.keys(value).length > 0, {
    message: 'At least one todo field is required.'
  })

export const requireTodoId = (event: Parameters<typeof getRouterParam>[0]) => {
  const todoId = getRouterParam(event, 'todoId')
  const result = z.uuid().safeParse(todoId)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A valid todo ID is required.'
    })
  }

  return result.data
}

export const parseCompletedFilter = (value: unknown) => {
  if (value === undefined) return undefined
  if (value === 'true') return true
  if (value === 'false') return false

  throw createError({
    statusCode: 400,
    statusMessage: 'Completed must be true or false.'
  })
}

export const parseCategoryFilter = (value: unknown) => {
  if (value === undefined) return undefined

  const result = z.enum(todoCategories).safeParse(value)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category is invalid.'
    })
  }

  return result.data
}
