import type { DomainTableField, DomainTableFilter, DomainTableOrder, DomainTableRecord } from '~/types/domain-table'
import { createSupabaseClient } from '~/libs/supabaseClient'

type EditableRecordConfig = {
  title: string
  addLabel: string
  fields: readonly DomainTableField[]
  filters?: readonly DomainTableFilter[]
  initialRecords?: readonly DomainTableRecord[]
  orderBy?: DomainTableOrder
  tableName?: string
}

type SupabaseError = {
  message: string
}

type SupabaseResult<T> = Promise<{
  data: T | null
  error: SupabaseError | null
}>

type SupabaseTable = {
  select: (columns?: string) => SupabaseSelectQuery
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

type SupabaseSelectQuery = {
  eq: (column: string, value: string | number | boolean) => SupabaseSelectQuery
  order: (column: string, options: { ascending: boolean }) => SupabaseResult<DomainTableRecord[]>
}

const getSupabaseTable = (tableName: string) => {
  const supabase = createSupabaseClient() as unknown as {
    from: (name: string) => SupabaseTable
  }

  return supabase.from(tableName)
}

export const useEditableRecords = (config: EditableRecordConfig) => {
  const toast = useToast()
  const fields = ref<DomainTableField[]>(config.fields.map(field => ({ ...field })))
  const records = ref<DomainTableRecord[]>((config.initialRecords ?? []).map(record => ({ ...record })))
  const isOpen = ref(false)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const selectedRecord = ref<DomainTableRecord | null>(null)
  const form = reactive<DomainTableRecord>({ id: '' })

  const tableFields = computed(() => fields.value.filter(field => field.table !== false))
  const modalTitle = computed(() => selectedRecord.value ? `Edit ${config.addLabel.replace(/^Add\s+/i, '')}` : config.addLabel)
  const isMissingValue = (value: unknown) => value === null || value === undefined || value === ''

  const formatLabel = (value: unknown) => {
    if (value === null || value === undefined || value === '') return '-'
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    if (typeof value === 'number') return new Intl.NumberFormat('en-US').format(value)

    return String(value)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase())
  }

  const resetForm = () => {
    form.id = selectedRecord.value?.id ?? crypto.randomUUID()

    for (const field of fields.value) {
      const selectedValue = selectedRecord.value?.[field.key]

      if (selectedValue !== undefined) {
        form[field.key] = selectedValue
      } else if (field.type === 'checkbox') {
        form[field.key] = false
      } else if (field.type === 'number') {
        form[field.key] = null
      } else {
        form[field.key] = field.options?.[0]?.value ?? ''
      }
    }
  }

  const openCreateModal = () => {
    selectedRecord.value = null
    resetForm()
    isOpen.value = true
  }

  const openEditModal = (record: DomainTableRecord) => {
    selectedRecord.value = record
    resetForm()
    isOpen.value = true
  }

  const closeModal = () => {
    isOpen.value = false
  }

  const fetchRecords = async () => {
    if (!config.tableName) return

    isLoading.value = true

    const orderBy = config.orderBy ?? { column: 'created_at', ascending: false }
    let query = getSupabaseTable(config.tableName)
      .select('*')

    for (const filter of config.filters ?? []) {
      query = query.eq(filter.column, filter.value)
    }

    const { data, error } = await query
      .order(orderBy.column, { ascending: orderBy.ascending ?? false })

    if (error) {
      toast.add({
        title: `Could not load ${config.title}`,
        description: error.message,
        icon: 'i-lucide-triangle-alert',
        color: 'error'
      })
    } else {
      records.value = (data ?? []).map(record => ({ ...record }))
    }

    isLoading.value = false
  }

  const fetchFieldOptions = async () => {
    const optionFields = fields.value.filter(field => field.optionSource)

    await Promise.all(optionFields.map(async (field) => {
      if (!field.optionSource) return

      const valueColumn = field.optionSource.valueColumn ?? 'id'
      const orderBy = field.optionSource.orderBy ?? { column: field.optionSource.labelColumn, ascending: true }
      const { data, error } = await getSupabaseTable(field.optionSource.tableName)
        .select(`${valueColumn},${field.optionSource.labelColumn}`)
        .order(orderBy.column, { ascending: orderBy.ascending ?? true })

      if (error) {
        toast.add({
          title: `Could not load ${field.label} options`,
          description: error.message,
          icon: 'i-lucide-triangle-alert',
          color: 'error'
        })
        return
      }

      field.options = (data ?? []).map(option => ({
        label: String(option[field.optionSource?.labelColumn ?? 'id'] ?? option.id),
        value: String(option[valueColumn] ?? '')
      }))
    }))
  }

  const saveRecord = async () => {
    const missingField = fields.value.find(field => field.required && isMissingValue(form[field.key]))

    if (missingField) {
      toast.add({
        title: 'Missing required field',
        description: `${missingField.label} is required.`,
        icon: 'i-lucide-triangle-alert',
        color: 'error'
      })
      return
    }

    const nextRecord = { ...form }
    isSaving.value = true

    if (config.tableName) {
      const payload = Object.fromEntries(
        Object.entries(nextRecord).filter(([, value]) => !isMissingValue(value))
      )
      const result = selectedRecord.value
        ? await getSupabaseTable(config.tableName).update(payload).eq('id', nextRecord.id).select().single()
        : await getSupabaseTable(config.tableName).insert(payload).select().single()

      if (result.error) {
        toast.add({
          title: selectedRecord.value ? 'Update failed' : 'Add failed',
          description: result.error.message,
          icon: 'i-lucide-triangle-alert',
          color: 'error'
        })
        isSaving.value = false
        return
      }

      if (result.data) {
        const index = records.value.findIndex(record => record.id === result.data?.id)

        if (index >= 0) {
          records.value[index] = { ...result.data }
        } else {
          records.value.unshift({ ...result.data })
        }
      }
    } else {
      const index = records.value.findIndex(record => record.id === nextRecord.id)

      if (index >= 0) {
        records.value[index] = nextRecord
      } else {
        records.value.unshift(nextRecord)
      }
    }

    toast.add({
      title: selectedRecord.value ? 'Updated' : 'Added',
      description: selectedRecord.value ? `${config.title} row updated.` : `${config.title} row added.`,
      icon: selectedRecord.value ? 'i-lucide-check' : 'i-lucide-plus',
      color: 'success'
    })
    isSaving.value = false
    isOpen.value = false
  }

  const loadPageData = async () => {
    await fetchFieldOptions()
    await fetchRecords()
  }

  const formatFieldValue = (value: unknown, field: DomainTableField) => {
    const option = field.options?.find(item => item.value === value)

    return option?.label ?? formatLabel(value)
  }

  onMounted(loadPageData)

  return {
    closeModal,
    fetchRecords,
    fields,
    form,
    formatFieldValue,
    formatLabel,
    isOpen,
    isLoading,
    isSaving,
    modalTitle,
    openCreateModal,
    openEditModal,
    records,
    saveRecord,
    tableFields
  }
}
