export type SupabaseError = {
  message: string
}

export type SupabaseResult<T> = Promise<{
  data: T | null
  error: SupabaseError | null
}>
