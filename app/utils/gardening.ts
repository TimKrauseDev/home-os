import { format, isAfter, isBefore, isToday, parseISO } from 'date-fns'
import type { GardenSeed, GardenSeedTaskRow, SeedCatalogRow, SowingWindow } from '~/types/gardening'
import { formatLabel } from '~/utils/formatters'
import { seedDepthItems } from '~/utils/options/gardening'

const seedDepthLabels = new Map<string, string>(seedDepthItems.map(item => [item.value, item.label]))

export const formatGardenDate = (date: string, pattern = 'MMM d, yyyy') => format(parseISO(date), pattern)

export const formatSeedDepth = (value: number | string | null) => {
  if (value === null) return '-'

  const depth = String(value)

  return seedDepthLabels.get(depth) ?? `${depth} in`
}

export const getSeedName = (seed: Pick<GardenSeed, 'type' | 'variety'> | null) => {
  if (!seed) return 'Unknown seed'

  return `${seed.variety} ${seed.type}`
}

export const isRecommendedSowingWindow = (seed: GardenSeed, window: SowingWindow) => {
  if (!seed.recommended_sow_method) return false

  return window.sow_method === seed.recommended_sow_method
}

export const getRecommendedSowingWindows = (seed: SeedCatalogRow) => {
  if (!seed.recommended_sow_method) return seed.garden_seed_sowing_windows

  return seed.garden_seed_sowing_windows.filter(window => window.sow_method === seed.recommended_sow_method)
}

export const formatSowingWindowTiming = (window: SowingWindow) => {
  const direction = formatLabel(window.sow_direction).toLowerCase()
  const reference = formatLabel(window.sow_reference).toLowerCase()

  return `${window.sow_start_weeks}-${window.sow_end_weeks} weeks ${direction} ${reference}`
}

export const formatSowingWindow = (window: SowingWindow) => {
  return `${formatLabel(window.sow_method)}: ${formatSowingWindowTiming(window)}`
}

export const isGardenTaskOverdue = (task: GardenSeedTaskRow, today = new Date()) => {
  return task.status === 'pending' && isBefore(parseISO(task.due_date), today) && !isToday(parseISO(task.due_date))
}

export const isGardenTaskUpcoming = (task: GardenSeedTaskRow, today = new Date()) => {
  return task.status === 'pending' && (isAfter(parseISO(task.due_date), today) || isToday(parseISO(task.due_date)))
}
