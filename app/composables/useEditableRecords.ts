import type {
  DomainTableField,
  DomainTableRecord,
  EditableRecordConfig
} from '~/types/domain-table'
import { formatDisplayValue } from '~/utils/formatters'

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

  const formatLabel = formatDisplayValue

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
    try {
      const data = await $fetch<DomainTableRecord[]>('/api/domain-records', {
        query: {
          tableName: config.tableName,
          orderColumn: orderBy.column,
          orderAscending: String(orderBy.ascending ?? false),
          filters: (config.filters ?? []).map(filter => JSON.stringify(filter))
        }
      })

      records.value = data.map(record => ({ ...record }))
    } catch (error) {
      toast.add({
        title: `Could not load ${config.title}`,
        description: error instanceof Error ? error.message : `${config.title} could not be loaded.`,
        icon: 'i-lucide-triangle-alert',
        color: 'error'
      })
    }

    isLoading.value = false
  }

  const fetchFieldOptions = async () => {
    const optionFields = fields.value.filter(field => field.optionSource)

    await Promise.all(optionFields.map(async (field) => {
      if (!field.optionSource) return

      const valueColumn = field.optionSource.valueColumn ?? 'id'
      const orderBy = field.optionSource.orderBy ?? { column: field.optionSource.labelColumn, ascending: true }
      try {
        const data = await $fetch<DomainTableRecord[]>('/api/domain-records', {
          query: {
            tableName: field.optionSource.tableName,
            select: `${valueColumn},${field.optionSource.labelColumn}`,
            orderColumn: orderBy.column,
            orderAscending: String(orderBy.ascending ?? true)
          }
        })

        field.options = data.map(option => ({
          label: String(option[field.optionSource?.labelColumn ?? 'id'] ?? option.id),
          value: String(option[valueColumn] ?? '')
        }))
      } catch (error) {
        toast.add({
          title: `Could not load ${field.label} options`,
          description: error instanceof Error ? error.message : `${field.label} options could not be loaded.`,
          icon: 'i-lucide-triangle-alert',
          color: 'error'
        })
      }
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
      try {
        const result = selectedRecord.value
          ? await $fetch<DomainTableRecord>(`/api/domain-records/${nextRecord.id}`, {
              method: 'PUT',
              body: {
                tableName: config.tableName,
                payload
              }
            })
          : await $fetch<DomainTableRecord>('/api/domain-records', {
              method: 'POST',
              body: {
                tableName: config.tableName,
                payload
              }
            })

        const index = records.value.findIndex(record => record.id === result.id)

        if (index >= 0) {
          records.value[index] = { ...result }
        } else {
          records.value.unshift({ ...result })
        }
      } catch (error) {
        toast.add({
          title: selectedRecord.value ? 'Update failed' : 'Add failed',
          description: error instanceof Error ? error.message : 'Record could not be saved.',
          icon: 'i-lucide-triangle-alert',
          color: 'error'
        })
        isSaving.value = false
        return
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
    const shouldFormatDate = field.type === 'date' || field.key.endsWith('_at') || field.key.endsWith('_date')

    if (shouldFormatDate && typeof value === 'string' && value) {
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: value.includes('T') ? 'short' : undefined
      }).format(new Date(value))
    }

    return option?.label ?? formatDisplayValue(value)
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
