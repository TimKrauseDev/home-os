export const formatLabel = (value: string | null | undefined) => {
  if (!value) return '-'

  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase())
}

export const formatBoolean = (value: boolean | null | undefined) => {
  if (value === null || value === undefined) return '-'

  return value ? 'Yes' : 'No'
}

export const formatInches = (value: number | null | undefined) => {
  if (value === null || value === undefined) return '-'

  return `${value} in`
}

export const formatDisplayValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') return '-'
  if (typeof value === 'boolean') return formatBoolean(value)
  if (typeof value === 'number') return new Intl.NumberFormat('en-US').format(value)

  return formatLabel(String(value))
}
