import type { SelectOption } from '~/types/select-options'

export const allFilterValue = 'all'

export const pageSizeItems = [10, 25, 50].map(size => ({
  label: `${size} per page`,
  value: size
})) satisfies SelectOption<number>[]
