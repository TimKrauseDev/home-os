export type DomainFieldOption = {
  label: string
  value: string
}

export type DomainTableField = {
  key: string
  label: string
  type?: 'checkbox' | 'date' | 'number' | 'select' | 'textarea' | 'text'
  optionSource?: {
    tableName: string
    labelColumn: string
    valueColumn?: string
    orderBy?: DomainTableOrder
  }
  options?: readonly DomainFieldOption[]
  required?: boolean
  table?: boolean
}

export type DomainTableRecord = {
  id: string
  [key: string]: boolean | number | string | null
}

export type DomainStatCard = {
  label: string
  value: string
  icon: string
}

export type DomainTableOrder = {
  column: string
  ascending?: boolean
}

export type DomainTableFilter = {
  column: string
  value: string | number | boolean
}
