export type MaintenanceCadenceType = 'custom' | 'monthly' | 'seasonal' | 'yearly'
export type MaintenanceCadenceUnit = 'days' | 'months' | 'weeks' | 'years'
export type MaintenanceSeason = 'fall' | 'spring' | 'summer' | 'winter'

export type MaintenanceCadence = {
  cadence_type: MaintenanceCadenceType
  cadence_interval?: number | null
  cadence_unit?: MaintenanceCadenceUnit | null
  season?: MaintenanceSeason | null
  preferred_month?: number | null
  preferred_day?: number | null
}
