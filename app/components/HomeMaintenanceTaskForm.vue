<script setup lang="ts">
import type {
  MaintenanceCadence,
  MaintenanceCadenceType,
  MaintenanceCadenceUnit,
  MaintenanceSeason
} from '~/utils/maintenanceCadence'
import {
  calculateMaintenanceDueDate,
  formatMaintenanceCadence
} from '~/utils/maintenanceCadence'
import { createSupabaseClient } from '~/libs/supabaseClient'

type MaintenanceTaskStatus = 'active' | 'archived' | 'in_progress' | 'paused'
type MaintenancePriority = 'high' | 'low' | 'medium'
type MaintenanceArea = 'exterior' | 'interior'
type MaintenanceCadenceRow = MaintenanceCadence & {
  id?: string
  notes?: string | null
}
type MaintenanceTaskRow = {
  id: string
  title: string
  description: string | null
  area: MaintenanceArea | null
  next_due_date: string | null
  last_completed_at: string | null
  status: MaintenanceTaskStatus
  priority: MaintenancePriority
  notes: string | null
  home_maintenance_task_cadences: MaintenanceCadenceRow[]
}
type MaintenanceTaskPayload = {
  title: string
  description: string | null
  area: MaintenanceArea | null
  next_due_date: string | null
  status: MaintenanceTaskStatus
  priority: MaintenancePriority
  notes: string | null
}
type MaintenanceCadencePayload = MaintenanceCadence & {
  task_id: string
  notes: string | null
}
type SupabaseResult<T> = Promise<{
  data: T | null
  error: { message: string } | null
}>
type SupabaseClient = {
  from: (table: string) => {
    delete: () => {
      eq: (column: string, value: string) => SupabaseResult<null>
    }
    insert: (payload: MaintenanceTaskPayload | MaintenanceCadencePayload | MaintenanceCadencePayload[]) => {
      select: () => {
        single: () => SupabaseResult<MaintenanceTaskRow>
      }
    }
    update: (payload: MaintenanceTaskPayload) => {
      eq: (column: string, value: string) => {
        select: () => {
          single: () => SupabaseResult<MaintenanceTaskRow>
        }
      }
    }
  }
}
type TaskForm = MaintenanceTaskPayload & {
  cadences: MaintenanceCadenceRow[]
}

const props = defineProps<{
  task?: MaintenanceTaskRow | null
  resetKey?: number
}>()

const emit = defineEmits<{
  cancel: []
  saved: []
}>()

const toast = useToast()
const isSaving = ref(false)
const formError = ref<string | null>(null)
const dueDateWasEdited = ref(false)

const statusItems = [
  { label: 'Active', value: 'active' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Paused', value: 'paused' },
  { label: 'Archived', value: 'archived' }
] satisfies { label: string, value: MaintenanceTaskStatus }[]
const priorityItems = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' }
] satisfies { label: string, value: MaintenancePriority }[]
const areaItems = [
  { label: 'Interior', value: 'interior' },
  { label: 'Exterior', value: 'exterior' }
] satisfies { label: string, value: MaintenanceArea }[]
const cadenceTypeItems = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Seasonal', value: 'seasonal' },
  { label: 'Yearly', value: 'yearly' },
  { label: 'Custom', value: 'custom' }
] satisfies { label: string, value: MaintenanceCadenceType }[]
const cadenceUnitItems = [
  { label: 'Days', value: 'days' },
  { label: 'Weeks', value: 'weeks' },
  { label: 'Months', value: 'months' },
  { label: 'Years', value: 'years' }
] satisfies { label: string, value: MaintenanceCadenceUnit }[]
const seasonItems = [
  { label: 'Spring', value: 'spring' },
  { label: 'Summer', value: 'summer' },
  { label: 'Fall', value: 'fall' },
  { label: 'Winter', value: 'winter' }
] satisfies { label: string, value: MaintenanceSeason }[]

const buildEmptyCadence = (): MaintenanceCadenceRow => ({
  cadence_type: 'monthly',
  cadence_interval: 1,
  cadence_unit: 'months',
  season: null,
  preferred_month: null,
  preferred_day: new Date().getDate(),
  notes: ''
})

const buildEmptyForm = (): TaskForm => ({
  title: '',
  description: '',
  area: 'interior',
  next_due_date: calculateMaintenanceDueDate([buildEmptyCadence()]),
  status: 'active',
  priority: 'medium',
  notes: '',
  cadences: [buildEmptyCadence()]
})

const form = reactive<TaskForm>(buildEmptyForm())
const isEditing = computed(() => Boolean(props.task))
const submitLabel = computed(() => isEditing.value ? 'Update Task' : 'Save Task')
const calculatedNextDueDate = computed(() => calculateMaintenanceDueDate(form.cadences))

const cleanText = (value: string | null | undefined) => {
  const trimmedValue = value?.trim()

  return trimmedValue ? trimmedValue : null
}

const setCadenceDefaults = (cadence: MaintenanceCadenceRow) => {
  if (cadence.cadence_type === 'monthly') {
    cadence.cadence_interval = null
    cadence.cadence_unit = null
    cadence.season = null
    cadence.preferred_month = null
    cadence.preferred_day ??= new Date().getDate()
  } else if (cadence.cadence_type === 'seasonal') {
    cadence.cadence_interval = null
    cadence.cadence_unit = null
    cadence.season ??= 'spring'
    cadence.preferred_month = null
    cadence.preferred_day ??= 1
  } else if (cadence.cadence_type === 'yearly') {
    cadence.cadence_interval = null
    cadence.cadence_unit = null
    cadence.season = null
    cadence.preferred_month ??= new Date().getMonth() + 1
    cadence.preferred_day ??= 1
  } else {
    cadence.cadence_interval ??= 1
    cadence.cadence_unit ??= 'months'
    cadence.season = null
    cadence.preferred_month = null
    cadence.preferred_day = null
  }
}

const applyCalculatedDueDate = () => {
  form.next_due_date = calculatedNextDueDate.value
  dueDateWasEdited.value = false
}

const addCadence = () => {
  form.cadences.push(buildEmptyCadence())
}

const removeCadence = (index: number) => {
  form.cadences.splice(index, 1)

  if (!form.cadences.length) {
    form.cadences.push(buildEmptyCadence())
  }
}

const populateForm = (task: MaintenanceTaskRow) => {
  Object.assign(form, {
    title: task.title,
    description: task.description ?? '',
    area: task.area ?? 'interior',
    next_due_date: task.next_due_date ?? '',
    status: task.status,
    priority: task.priority,
    notes: task.notes ?? '',
    cadences: task.home_maintenance_task_cadences.length
      ? task.home_maintenance_task_cadences.map(cadence => ({ ...cadence, notes: cadence.notes ?? '' }))
      : [buildEmptyCadence()]
  })
  dueDateWasEdited.value = Boolean(task.next_due_date)
}

const resetForm = () => {
  if (props.task) {
    populateForm(props.task)
  } else {
    Object.assign(form, buildEmptyForm())
    dueDateWasEdited.value = false
  }

  formError.value = null
}

watch(() => props.resetKey, resetForm)
watch(() => props.task, resetForm, { immediate: true })

watch(() => form.cadences, () => {
  for (const cadence of form.cadences) {
    setCadenceDefaults(cadence)
  }

  if (!dueDateWasEdited.value) {
    form.next_due_date = calculatedNextDueDate.value
  }
}, { deep: true })

const validateForm = () => {
  if (!form.title.trim()) return 'Task title is required.'
  if (!form.cadences.length) return 'Add at least one cadence.'

  return null
}

const buildTaskPayload = (): MaintenanceTaskPayload => ({
  title: form.title.trim(),
  description: cleanText(form.description),
  area: form.area,
  next_due_date: form.next_due_date || null,
  status: form.status,
  priority: form.priority,
  notes: cleanText(form.notes)
})

const buildCadencePayloads = (taskId: string): MaintenanceCadencePayload[] => form.cadences.map(cadence => ({
  task_id: taskId,
  cadence_type: cadence.cadence_type,
  cadence_interval: cadence.cadence_type === 'custom' ? cadence.cadence_interval : null,
  cadence_unit: cadence.cadence_type === 'custom' ? cadence.cadence_unit : null,
  season: cadence.cadence_type === 'seasonal' ? cadence.season : null,
  preferred_month: cadence.cadence_type === 'yearly' ? cadence.preferred_month : null,
  preferred_day: cadence.cadence_type !== 'custom' ? cadence.preferred_day : null,
  notes: cleanText(cadence.notes)
}))

const saveTask = async () => {
  formError.value = validateForm()
  if (formError.value) return

  isSaving.value = true

  try {
    const supabase = createSupabaseClient() as unknown as SupabaseClient
    const taskPayload = buildTaskPayload()
    const taskResponse = isEditing.value && props.task
      ? await supabase.from('home_maintenance_tasks').update(taskPayload).eq('id', props.task.id).select().single()
      : await supabase.from('home_maintenance_tasks').insert(taskPayload).select().single()

    if (taskResponse.error) throw new Error(taskResponse.error.message)
    if (!taskResponse.data) throw new Error('Task was saved, but no row was returned.')

    const taskId = taskResponse.data.id
    const deleteResponse = await supabase.from('home_maintenance_task_cadences').delete().eq('task_id', taskId)
    if (deleteResponse.error) throw new Error(deleteResponse.error.message)

    for (const cadencePayload of buildCadencePayloads(taskId)) {
      const cadenceResponse = await supabase.from('home_maintenance_task_cadences').insert(cadencePayload).select().single()
      if (cadenceResponse.error) throw new Error(cadenceResponse.error.message)
    }

    toast.add({
      title: isEditing.value ? 'Maintenance task updated' : 'Maintenance task added',
      description: `${form.title.trim()} was ${isEditing.value ? 'updated' : 'added'}.`,
      icon: 'i-lucide-list-checks',
      color: 'success'
    })
    resetForm()
    emit('saved')
  } catch (error) {
    formError.value = error instanceof Error ? error.message : 'Maintenance task could not be saved.'
    toast.add({
      title: 'Maintenance task could not be saved',
      description: formError.value,
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <form class="flex flex-col gap-5" @submit.prevent="saveTask">
    <UAlert
      v-if="formError"
      title="Task could not be saved"
      :description="formError"
      color="error"
      icon="i-lucide-triangle-alert"
    />

    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField
        label="Task"
        name="title"
        required
        class="sm:col-span-2"
      >
        <UInput v-model="form.title" placeholder="Replace HVAC filter" />
      </UFormField>

      <UFormField label="Area" name="area">
        <select v-model="form.area" class="h-9 w-full rounded-md border border-default bg-default px-3 text-sm text-highlighted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20">
          <option v-for="item in areaItems" :key="item.value" :value="item.value">
            {{ item.label }}
          </option>
        </select>
      </UFormField>

      <UFormField label="Priority" name="priority">
        <select v-model="form.priority" class="h-9 w-full rounded-md border border-default bg-default px-3 text-sm text-highlighted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20">
          <option v-for="item in priorityItems" :key="item.value" :value="item.value">
            {{ item.label }}
          </option>
        </select>
      </UFormField>

      <UFormField label="Status" name="status">
        <select v-model="form.status" class="h-9 w-full rounded-md border border-default bg-default px-3 text-sm text-highlighted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20">
          <option v-for="item in statusItems" :key="item.value" :value="item.value">
            {{ item.label }}
          </option>
        </select>
      </UFormField>

      <UFormField label="Next Due" name="next_due_date">
        <div class="flex gap-2">
          <UInput
            v-model="form.next_due_date"
            type="date"
            @update:model-value="dueDateWasEdited = true"
          />
          <UButton
            label="Use Cadence"
            color="neutral"
            variant="outline"
            type="button"
            class="w-fit"
            @click="applyCalculatedDueDate"
          />
        </div>
      </UFormField>

      <UFormField label="Description" name="description" class="sm:col-span-2">
        <UTextarea v-model="form.description" :rows="2" />
      </UFormField>
    </div>

    <div class="grid gap-3">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h3 class="text-sm font-medium">
            Cadence
          </h3>
          <p class="text-sm text-muted">
            Defaults next due to {{ calculatedNextDueDate || '-' }}.
          </p>
        </div>
        <UButton
          label="Add Cadence"
          icon="i-lucide-plus"
          color="neutral"
          variant="outline"
          type="button"
          class="w-fit"
          @click="addCadence"
        />
      </div>

      <div
        v-for="(cadence, index) in form.cadences"
        :key="index"
        class="grid gap-3 rounded-md border border-default p-3 sm:grid-cols-2"
      >
        <UFormField label="Cadence Type">
          <select v-model="cadence.cadence_type" class="h-9 w-full rounded-md border border-default bg-default px-3 text-sm text-highlighted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20">
            <option v-for="item in cadenceTypeItems" :key="item.value" :value="item.value">
              {{ item.label }}
            </option>
          </select>
        </UFormField>

        <UFormField
          v-if="cadence.cadence_type === 'seasonal'"
          label="Season"
        >
          <select v-model="cadence.season" class="h-9 w-full rounded-md border border-default bg-default px-3 text-sm text-highlighted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20">
            <option v-for="item in seasonItems" :key="item.value" :value="item.value">
              {{ item.label }}
            </option>
          </select>
        </UFormField>

        <template v-else-if="cadence.cadence_type === 'custom'">
          <UFormField label="Every">
            <UInputNumber v-model="cadence.cadence_interval" :min="1" />
          </UFormField>
          <UFormField label="Unit">
            <select v-model="cadence.cadence_unit" class="h-9 w-full rounded-md border border-default bg-default px-3 text-sm text-highlighted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20">
              <option v-for="item in cadenceUnitItems" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
          </UFormField>
        </template>

        <UFormField
          v-if="cadence.cadence_type === 'yearly'"
          label="Month"
        >
          <UInputNumber v-model="cadence.preferred_month" :min="1" :max="12" />
        </UFormField>

        <UFormField
          v-if="cadence.cadence_type !== 'custom'"
          label="Preferred Day"
        >
          <UInputNumber v-model="cadence.preferred_day" :min="1" :max="28" />
        </UFormField>

        <div class="flex items-center justify-between gap-3 sm:col-span-2">
          <p class="text-sm text-muted">
            {{ formatMaintenanceCadence(cadence) }}
          </p>
          <UButton
            icon="i-lucide-trash-2"
            color="neutral"
            variant="ghost"
            type="button"
            :disabled="form.cadences.length === 1"
            @click="removeCadence(index)"
          />
        </div>
      </div>
    </div>

    <UFormField label="Notes" name="notes">
      <UTextarea v-model="form.notes" :rows="4" />
    </UFormField>

    <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <UButton
        label="Cancel"
        color="neutral"
        variant="outline"
        type="button"
        :disabled="isSaving"
        @click="emit('cancel')"
      />
      <UButton
        type="submit"
        :label="submitLabel"
        icon="i-lucide-save"
        :loading="isSaving"
      />
    </div>
  </form>
</template>
