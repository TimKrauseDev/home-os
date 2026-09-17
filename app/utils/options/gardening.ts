import type { BadgeProps } from '@nuxt/ui'
import type {
  GardenSeed,
  GardenSeedTaskStatus,
  SeedDepth,
  SowDirection,
  SowMethod,
  SowReference,
  SunType
} from '~/types/gardening'
import type { IconSelectOption, SelectOption } from '~/types/select-options'
import { allFilterValue } from '~/utils/options/common'

export type GardenSeedFeatureDefinition = {
  label: string
  value: 'deer_resistant' | 'succession_planted'
  icon: string
  color: BadgeProps['color']
  matches: (seed: GardenSeed) => boolean
}

export const sowMethodFormItems = [
  { label: 'Inside', value: 'inside' },
  { label: 'Outside', value: 'outside' },
  { label: 'Either', value: 'either' }
] satisfies SelectOption<SowMethod>[]

export const optionalSowMethodItems = [
  { label: 'None', value: null },
  ...sowMethodFormItems
] satisfies SelectOption<SowMethod | null>[]

export const sowMethodFilterItems = [
  { label: 'All sow methods', value: allFilterValue },
  ...sowMethodFormItems
] satisfies SelectOption<SowMethod | typeof allFilterValue>[]

export const sowReferenceItems = [
  { label: 'Last frost', value: 'last_frost' },
  { label: 'First frost', value: 'first_frost' }
] satisfies SelectOption<SowReference>[]

export const sowDirectionItems = [
  { label: 'Before', value: 'before' },
  { label: 'After', value: 'after' }
] satisfies SelectOption<SowDirection>[]

export const sunTypeItems = [
  { label: 'Full sun', value: 'full_sun' },
  { label: 'Partial sun', value: 'partial_sun' },
  { label: 'Partial shade', value: 'partial_shade' },
  { label: 'Shade', value: 'shade' },
  { label: 'Unknown', value: 'unknown' }
] satisfies SelectOption<SunType>[]

export const seedDepthItems = [
  { label: 'Surface', value: '0' },
  { label: '1/8 in', value: '0.125' },
  { label: '1/4 in', value: '0.25' },
  { label: '1/2 in', value: '0.5' },
  { label: '3/4 in', value: '0.75' },
  { label: '1 in', value: '1' }
] satisfies SelectOption<SeedDepth>[]

export const optionalSeedDepthItems = [
  { label: 'None', value: null },
  ...seedDepthItems
] satisfies SelectOption<SeedDepth | null>[]

export const gardenSeedTaskStatusItems = [
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Skipped', value: 'skipped' },
  { label: 'Canceled', value: 'canceled' }
] satisfies SelectOption<GardenSeedTaskStatus>[]

export const gardenSeedTaskStatusFilterItems = [
  ...gardenSeedTaskStatusItems,
  { label: 'All statuses', value: allFilterValue }
] satisfies SelectOption<GardenSeedTaskStatus | typeof allFilterValue>[]

export const gardenSeedTaskWindowItems = [
  { label: 'Active', value: 'active' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Completed', value: 'completed' },
  { label: 'All tasks', value: 'all' }
] satisfies SelectOption<'active' | 'all' | 'completed' | 'overdue' | 'upcoming'>[]

export const gardenSeedTaskStatusMeta = {
  pending: {
    label: 'Pending',
    color: 'warning',
    icon: 'i-lucide-clock'
  },
  completed: {
    label: 'Completed',
    color: 'success',
    icon: 'i-lucide-check'
  },
  skipped: {
    label: 'Skipped',
    color: 'neutral',
    icon: 'i-lucide-forward'
  },
  canceled: {
    label: 'Canceled',
    color: 'error',
    icon: 'i-lucide-circle-x'
  }
} as const

export const seedFeatureDefinitions = [
  {
    label: 'Deer resistant',
    value: 'deer_resistant',
    icon: 'i-lucide-shield-check',
    color: 'neutral',
    matches: (seed: GardenSeed) => seed.is_deer_resistant === true
  },
  {
    label: 'Succession planted',
    value: 'succession_planted',
    icon: 'i-lucide-repeat',
    color: 'primary',
    matches: (seed: GardenSeed) => seed.is_succession_planted
  }
] satisfies GardenSeedFeatureDefinition[]

export const seedFeatureFilterItems = [
  { label: 'All features', value: allFilterValue },
  ...seedFeatureDefinitions.map(feature => ({
    label: feature.label,
    value: feature.value,
    icon: feature.icon
  }))
] satisfies IconSelectOption<GardenSeedFeatureDefinition['value'] | typeof allFilterValue>[]
