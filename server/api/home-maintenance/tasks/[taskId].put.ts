import type { MaintenanceCadencePayload, MaintenanceTaskPayload } from '~/types/home-maintenance'
import { createServerSupabaseClient, throwSupabaseError } from '../../../lib/apiSupabase'

export default defineEventHandler(async (event) => {
  const taskId = getRouterParam(event, 'taskId')
  const body = await readBody<{
    cadences?: Omit<MaintenanceCadencePayload, 'task_id'>[]
    task: MaintenanceTaskPayload
  }>(event)

  if (!taskId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Task ID is required.'
    })
  }

  const supabase = createServerSupabaseClient()
  const { data: task, error: taskError } = await supabase
    .from('home_maintenance_tasks')
    .update(body.task as never)
    .eq('id', taskId as never)
    .select()
    .single()

  throwSupabaseError(taskError, 'Maintenance task could not be updated.')
  if (!task) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Maintenance task was updated, but no row was returned.'
    })
  }

  const { error: deleteError } = await supabase
    .from('home_maintenance_task_cadences')
    .delete()
    .eq('task_id', task.id as never)

  throwSupabaseError(deleteError, 'Existing maintenance cadences could not be replaced.')

  for (const cadence of body.cadences ?? []) {
    const { error } = await supabase
      .from('home_maintenance_task_cadences')
      .insert({ ...cadence, task_id: task.id } as never)
      .select()
      .single()

    throwSupabaseError(error, 'Maintenance cadence could not be added.')
  }

  return task
})
