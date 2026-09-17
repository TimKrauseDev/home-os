export const cleanText = (value: string | null | undefined) => {
  const trimmedValue = value?.trim()

  return trimmedValue ? trimmedValue : null
}
