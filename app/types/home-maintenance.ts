import type { MaintenanceCadence } from '~/types/maintenance-cadence'
import type { SupabaseResult } from '~/types/supabase'

export type MaintenanceTaskStatus = 'active' | 'archived' | 'in_progress' | 'paused'
export type MaintenancePriority = 'high' | 'low' | 'medium'
export type MaintenanceArea = 'exterior' | 'interior'

export type MaintenanceCadenceRow = MaintenanceCadence & {
  id?: string
  notes?: string | null
}

export type MaintenanceTaskRow = {
  id: string
  title: string
  description: string | null
  area: MaintenanceArea | null
  next_due_date: string | null
  last_completed_at: string | null
  status: MaintenanceTaskStatus
  priority: MaintenancePriority
  notes: string | null
  home_maintenance_task_cadences: MaintenanceCadenceRow[]
}

export type MaintenanceTaskPayload = {
  title: string
  description: string | null
  area: MaintenanceArea | null
  next_due_date: string | null
  status: MaintenanceTaskStatus
  priority: MaintenancePriority
  notes: string | null
}

export type MaintenanceCadencePayload = MaintenanceCadence & {
  task_id: string
  notes: string | null
}

export type MaintenanceTaskFormState = MaintenanceTaskPayload & {
  cadences: MaintenanceCadenceRow[]
}

export type MaintenanceTasksSupabaseClient = {
  from: (table: string) => {
    insert: (payload: Record<string, unknown>) => SupabaseResult<null>
    select: (columns: string) => {
      order: (column: string, options: { ascending: boolean }) => SupabaseResult<MaintenanceTaskRow[]>
    }
    update: (payload: Record<string, unknown>) => {
      eq: (column: string, value: string) => SupabaseResult<null>
    }
  }
}

export type MaintenanceTaskFormSupabaseClient = {
  from: (table: string) => {
    delete: () => {
      eq: (column: string, value: string) => SupabaseResult<null>
    }
    insert: (payload: MaintenanceCadencePayload | MaintenanceCadencePayload[] | MaintenanceTaskPayload) => {
      select: () => {
        single: () => SupabaseResult<MaintenanceTaskRow>
      }
    }
    update: (payload: MaintenanceTaskPayload) => {
      eq: (column: string, value: string) => {
        select: () => {
          single: () => SupabaseResult<MaintenanceTaskRow>
        }
      }
    }
  }
}
