import type { SupabaseResult } from '~/types/supabase'

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

export type EditableRecordConfig = {
  title: string
  addLabel: string
  fields: readonly DomainTableField[]
  filters?: readonly DomainTableFilter[]
  initialRecords?: readonly DomainTableRecord[]
  orderBy?: DomainTableOrder
  tableName?: string
}

export type EditableRecordsSupabaseTable = {
  select: (columns?: string) => EditableRecordsSupabaseSelectQuery
  insert: (row: Record<string, unknown>) => {
    select: () => {
      single: () => SupabaseResult<DomainTableRecord>
    }
  }
  update: (row: Record<string, unknown>) => {
    eq: (column: string, value: string) => {
      select: () => {
        single: () => SupabaseResult<DomainTableRecord>
      }
    }
  }
}

export type EditableRecordsSupabaseSelectQuery = {
  eq: (column: string, value: string | number | boolean) => EditableRecordsSupabaseSelectQuery
  order: (column: string, options: { ascending: boolean }) => SupabaseResult<DomainTableRecord[]>
}
