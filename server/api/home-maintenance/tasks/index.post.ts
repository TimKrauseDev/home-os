import type { MaintenanceCadencePayload, MaintenanceTaskPayload } from '~/types/home-maintenance'
import { createServerSupabaseClient, throwSupabaseError } from '../../../lib/apiSupabase'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    cadences?: Omit<MaintenanceCadencePayload, 'task_id'>[]
    task: MaintenanceTaskPayload
  }>(event)

  const supabase = createServerSupabaseClient()
  const { data: task, error: taskError } = await supabase
    .from('home_maintenance_tasks')
    .insert(body.task as never)
    .select()
    .single()

  throwSupabaseError(taskError, 'Maintenance task could not be added.')
  if (!task) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Maintenance task was saved, but no row was returned.'
    })
  }

  for (const cadence of body.cadences ?? []) {
    const { error } = await supabase
      .from('home_maintenance_task_cadences')
      .insert({ ...cadence, task_id: task.id } as never)
      .select()
      .single()

    throwSupabaseError(error, 'Maintenance cadence could not be added.')
  }

  setResponseStatus(event, 201)

  return task
})
