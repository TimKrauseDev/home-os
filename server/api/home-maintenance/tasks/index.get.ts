import type { MaintenanceTaskRow } from '~/types/home-maintenance'
import { createServerSupabaseClient, throwSupabaseError } from '../../../lib/apiSupabase'

export default defineEventHandler(async () => {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('home_maintenance_tasks')
    .select('*, home_maintenance_task_cadences(*)')
    .order('next_due_date', { ascending: true })

  throwSupabaseError(error, 'Maintenance tasks could not be loaded.')

  return (data ?? []) as MaintenanceTaskRow[]
})
