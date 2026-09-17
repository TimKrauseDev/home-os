import { addDays, addMonths, addWeeks, addYears, format, isBefore, setDate, setMonth, startOfDay } from 'date-fns'
import type { MaintenanceCadence, MaintenanceSeason } from '~/types/maintenance-cadence'

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
