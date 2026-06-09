import { addDays, addMonths, addWeeks, addYears, format, isBefore, setDate, setMonth, startOfDay } from 'date-fns'

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

const seasonStartMonth: Record<MaintenanceSeason, number> = {
  spring: 3,
  summer: 6,
  fall: 9,
  winter: 12
}

const applyDay = (date: Date, preferredDay?: number | null) => {
  if (!preferredDay) return date

  return setDate(date, Math.min(preferredDay, 28))
}

export const formatMaintenanceDate = (value: string | null | undefined) => {
  if (!value) return '-'

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: value.includes('T') ? 'short' : undefined
  }).format(new Date(value))
}

export const formatMaintenanceCadence = (cadence: MaintenanceCadence) => {
  if (cadence.cadence_type === 'monthly') {
    return cadence.preferred_day ? `Monthly on day ${cadence.preferred_day}` : 'Monthly'
  }

  if (cadence.cadence_type === 'yearly') {
    const month = cadence.preferred_month ? format(setMonth(new Date(), cadence.preferred_month - 1), 'MMMM') : 'year'
    return `Yearly in ${month}${cadence.preferred_day ? ` on day ${cadence.preferred_day}` : ''}`
  }

  if (cadence.cadence_type === 'seasonal') {
    return cadence.season ? `${cadence.season.replace(/\b\w/g, letter => letter.toUpperCase())}` : 'Seasonal'
  }

  const interval = cadence.cadence_interval ?? 1
  const unit = cadence.cadence_unit ?? 'months'

  return `Every ${interval} ${unit}`
}

export const calculateMaintenanceDueDate = (cadences: MaintenanceCadence[], fromDate = new Date()) => {
  const today = startOfDay(fromDate)
  const dueDates = cadences
    .map((cadence) => {
      if (cadence.cadence_type === 'monthly') {
        let dueDate = applyDay(today, cadence.preferred_day)
        if (isBefore(dueDate, today)) dueDate = addMonths(dueDate, 1)
        return dueDate
      }

      if (cadence.cadence_type === 'yearly') {
        let dueDate = setMonth(today, (cadence.preferred_month ?? today.getMonth() + 1) - 1)
        dueDate = applyDay(dueDate, cadence.preferred_day)
        if (isBefore(dueDate, today)) dueDate = addYears(dueDate, 1)
        return dueDate
      }

      if (cadence.cadence_type === 'seasonal') {
        const month = seasonStartMonth[cadence.season ?? 'spring']
        let dueDate = setMonth(today, month - 1)
        dueDate = applyDay(dueDate, cadence.preferred_day ?? 1)
        if (isBefore(dueDate, today)) dueDate = addYears(dueDate, 1)
        return dueDate
      }

      const interval = cadence.cadence_interval ?? 1
      const unit = cadence.cadence_unit ?? 'months'

      if (unit === 'days') return addDays(today, interval)
      if (unit === 'weeks') return addWeeks(today, interval)
      if (unit === 'years') return addYears(today, interval)

      return addMonths(today, interval)
    })
    .sort((dateA, dateB) => dateA.getTime() - dateB.getTime())

  return dueDates[0] ? format(dueDates[0], 'yyyy-MM-dd') : ''
}
