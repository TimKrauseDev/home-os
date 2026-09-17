export type SelectOption<TValue extends boolean | number | string | null = string> = {
  label: string
  value: TValue
}

export type IconSelectOption<TValue extends boolean | number | string | null = string> = SelectOption<TValue> & {
  icon?: string
}
