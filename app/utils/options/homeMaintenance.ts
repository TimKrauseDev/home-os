import type {
  MaintenanceArea,
  MaintenancePriority,
  MaintenanceTaskStatus
} from '~/types/home-maintenance'
import type {
  MaintenanceCadenceType,
  MaintenanceCadenceUnit,
  MaintenanceSeason
} from '~/types/maintenance-cadence'
import type { SelectOption } from '~/types/select-options'
import { allFilterValue } from '~/utils/options/common'

export const maintenanceAreaItems = [
  { label: 'Interior', value: 'interior' },
  { label: 'Exterior', value: 'exterior' }
] satisfies SelectOption<MaintenanceArea>[]

export const maintenanceAreaFilterItems = [
  { label: 'All areas', value: allFilterValue },
  ...maintenanceAreaItems
] satisfies SelectOption<MaintenanceArea | typeof allFilterValue>[]

export const maintenanceStatusItems = [
  { label: 'Active', value: 'active' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Paused', value: 'paused' },
  { label: 'Archived', value: 'archived' }
] satisfies SelectOption<MaintenanceTaskStatus>[]

export const maintenanceStatusFilterItems = [
  { label: 'All statuses', value: allFilterValue },
  ...maintenanceStatusItems
] satisfies SelectOption<MaintenanceTaskStatus | typeof allFilterValue>[]

export const maintenancePriorityItems = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' }
] satisfies SelectOption<MaintenancePriority>[]

export const maintenancePriorityFilterItems = [
  { label: 'All priorities', value: allFilterValue },
  ...maintenancePriorityItems
] satisfies SelectOption<MaintenancePriority | typeof allFilterValue>[]

export const maintenanceCadenceTypeItems = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Seasonal', value: 'seasonal' },
  { label: 'Yearly', value: 'yearly' },
  { label: 'Custom', value: 'custom' }
] satisfies SelectOption<MaintenanceCadenceType>[]

export const maintenanceCadenceTypeFilterItems = [
  { label: 'All cadences', value: allFilterValue },
  ...maintenanceCadenceTypeItems
] satisfies SelectOption<MaintenanceCadenceType | typeof allFilterValue>[]

export const maintenanceCadenceUnitItems = [
  { label: 'Days', value: 'days' },
  { label: 'Weeks', value: 'weeks' },
  { label: 'Months', value: 'months' },
  { label: 'Years', value: 'years' }
] satisfies SelectOption<MaintenanceCadenceUnit>[]

export const maintenanceSeasonItems = [
  { label: 'Spring', value: 'spring' },
  { label: 'Summer', value: 'summer' },
  { label: 'Fall', value: 'fall' },
  { label: 'Winter', value: 'winter' }
] satisfies SelectOption<MaintenanceSeason>[]
