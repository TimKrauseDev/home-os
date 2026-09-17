import { addDays, parseISO } from 'date-fns'
import type { MaintenanceTaskRow } from '~/types/home-maintenance'
import { createServerSupabaseClient, throwSupabaseError } from '../../../../lib/apiSupabase'
import { calculateMaintenanceDueDate } from '../../../../lib/maintenanceCadence'

export default defineEventHandler(async (event) => {
  const taskId = getRouterParam(event, 'taskId')
  const body = await readBody<{
    action?: 'complete' | 'skip'
    notes?: string
  }>(event)

  if (!taskId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Task ID is required.'
    })
  }

  if (body.action !== 'complete' && body.action !== 'skip') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Action must be complete or skip.'
    })
  }

  const supabase = createServerSupabaseClient()
  const { data: task, error: taskError } = await supabase
    .from('home_maintenance_tasks')
    .select('*, home_maintenance_task_cadences(*)')
    .eq('id', taskId)
    .single()

  throwSupabaseError(taskError, 'Maintenance task could not be loaded.')

  const typedTask = task as MaintenanceTaskRow
  const now = new Date().toISOString()
  const fromDate = typedTask.next_due_date
    ? addDays(parseISO(typedTask.next_due_date), 1)
    : addDays(new Date(), 1)
  const nextDueDate = calculateMaintenanceDueDate(typedTask.home_maintenance_task_cadences, fromDate)

  if (body.action === 'complete') {
    const { error } = await supabase
      .from('home_maintenance_completions')
      .insert({
        task_id: taskId,
        completed_at: now,
        notes: body.notes ?? 'Completed from maintenance tasks.'
      })

    throwSupabaseError(error, 'Maintenance completion could not be recorded.')
  }

  const { error } = await supabase
    .from('home_maintenance_tasks')
    .update({
      last_completed_at: body.action === 'complete' ? now : typedTask.last_completed_at,
      next_due_date: nextDueDate || null,
      status: 'active'
    })
    .eq('id', taskId)

  throwSupabaseError(error, 'Maintenance task could not be updated.')

  return {
    nextDueDate
  }
})
