<script setup lang="ts">
import type {
  MaintenanceCadenceUnit,
  MaintenanceSeason
} from '~/types/maintenance-cadence'
import type {
  MaintenanceArea,
  MaintenanceCadencePayload,
  MaintenanceCadenceRow,
  MaintenanceTaskFormState,
  MaintenanceTaskPayload,
  MaintenanceTaskRow
} from '~/types/home-maintenance'
import {
  calculateMaintenanceDueDate,
  formatMaintenanceCadence
} from '~/utils/maintenanceCadence'
import { cleanText } from '~/utils/form'
import {
  maintenanceAreaItems,
  maintenanceCadenceTypeItems,
  maintenanceCadenceUnitItems,
  maintenancePriorityItems,
  maintenanceSeasonItems,
  maintenanceStatusItems
} from '~/utils/options/homeMaintenance'

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

const buildEmptyCadence = (): MaintenanceCadenceRow => ({
  cadence_type: 'monthly',
  cadence_interval: 1,
  cadence_unit: 'months',
  season: null,
  preferred_month: null,
  preferred_day: new Date().getDate(),
  notes: ''
})

const buildEmptyForm = (): MaintenanceTaskFormState => ({
  title: '',
  description: '',
  area: 'interior',
  next_due_date: calculateMaintenanceDueDate([buildEmptyCadence()]),
  status: 'active',
  priority: 'medium',
  notes: '',
  cadences: [buildEmptyCadence()]
})

const form = reactive<MaintenanceTaskFormState>(buildEmptyForm())
const isEditing = computed(() => Boolean(props.task))
const submitLabel = computed(() => isEditing.value ? 'Update Task' : 'Save Task')
const calculatedNextDueDate = computed(() => calculateMaintenanceDueDate(form.cadences))

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

const setArea = (value: unknown) => {
  form.area = value as MaintenanceArea
}

const setCadenceSeason = (cadence: MaintenanceCadenceRow, value: unknown) => {
  cadence.season = value as MaintenanceSeason
}

const setCadenceUnit = (cadence: MaintenanceCadenceRow, value: unknown) => {
  cadence.cadence_unit = value as MaintenanceCadenceUnit
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
    const taskPayload = buildTaskPayload()
    const cadences = buildCadencePayloads(props.task?.id ?? '').map(({ task_id: _taskId, ...cadence }) => cadence)

    if (isEditing.value && props.task) {
      await $fetch(`/api/home-maintenance/tasks/${props.task.id}`, {
        method: 'PUT',
        body: {
          task: taskPayload,
          cadences
        }
      })
    } else {
      await $fetch('/api/home-maintenance/tasks', {
        method: 'POST',
        body: {
          task: taskPayload,
          cadences
        }
      })
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
  <UForm
    :state="form"
    class="flex flex-col gap-5"
    @submit="saveTask"
  >
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
        <USelect
          :model-value="form.area ?? 'interior'"
          :items="maintenanceAreaItems"
          class="w-full"
          @update:model-value="setArea"
        />
      </UFormField>

      <UFormField label="Priority" name="priority">
        <USelect
          v-model="form.priority"
          :items="maintenancePriorityItems"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Status" name="status">
        <USelect
          v-model="form.status"
          :items="maintenanceStatusItems"
          class="w-full"
        />
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
          <USelect
            v-model="cadence.cadence_type"
            :items="maintenanceCadenceTypeItems"
            class="w-full"
          />
        </UFormField>

        <UFormField
          v-if="cadence.cadence_type === 'seasonal'"
          label="Season"
        >
          <USelect
            :model-value="cadence.season ?? 'spring'"
            :items="maintenanceSeasonItems"
            class="w-full"
            @update:model-value="value => setCadenceSeason(cadence, value)"
          />
        </UFormField>

        <template v-else-if="cadence.cadence_type === 'custom'">
          <UFormField label="Every">
            <UInputNumber v-model="cadence.cadence_interval" :min="1" />
          </UFormField>
          <UFormField label="Unit">
            <USelect
              :model-value="cadence.cadence_unit ?? 'months'"
              :items="maintenanceCadenceUnitItems"
              class="w-full"
              @update:model-value="value => setCadenceUnit(cadence, value)"
            />
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
  </UForm>
</template>
