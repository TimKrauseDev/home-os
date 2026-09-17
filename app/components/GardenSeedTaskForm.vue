<script setup lang="ts">
import type {
  GardenSeedTaskForm,
  GardenSeedTaskInsert,
  GardenSeedTaskRow,
  GardenSeedTaskSeedOption,
  GardenSeedTaskUpdate
} from '~/types/gardening'
import { cleanText } from '~/utils/form'
import { gardenSeedTaskStatusItems } from '~/utils/options/gardening'

const props = defineProps<{
  seeds: GardenSeedTaskSeedOption[]
  task?: GardenSeedTaskRow | null
  resetKey?: number
}>()

const emit = defineEmits<{
  cancel: []
  saved: []
}>()

const toast = useToast()
const isSavingTask = ref(false)
const taskFormError = ref<string | null>(null)

const isEditing = computed(() => Boolean(props.task))
const submitLabel = computed(() => isEditing.value ? 'Update Task' : 'Save Task')
const seedOptions = computed(() => props.seeds.map(seed => ({
  label: `${seed.variety} ${seed.type}${seed.location_number ? ` (${seed.location_number})` : ''}`,
  value: seed.id
})))

const buildEmptyTaskForm = (): GardenSeedTaskForm => ({
  seed_id: props.seeds[0]?.id ?? '',
  title: '',
  due_date: new Date().toISOString().slice(0, 10),
  status: 'pending',
  notes: ''
})

const taskForm = reactive<GardenSeedTaskForm>(buildEmptyTaskForm())

const populateTaskForm = (task: GardenSeedTaskRow) => {
  Object.assign(taskForm, {
    seed_id: task.seed_id,
    title: task.title,
    due_date: task.due_date,
    status: task.status,
    notes: task.notes ?? ''
  })
}

const resetTaskForm = () => {
  if (props.task) {
    populateTaskForm(props.task)
  } else {
    Object.assign(taskForm, buildEmptyTaskForm())
  }

  taskFormError.value = null
}

watch(() => props.resetKey, () => {
  resetTaskForm()
})

watch(() => props.task, () => {
  resetTaskForm()
}, { immediate: true })

watch(() => props.seeds, () => {
  if (!taskForm.seed_id && props.seeds[0]) {
    taskForm.seed_id = props.seeds[0].id
  }
})

const validateTaskForm = () => {
  if (!taskForm.seed_id) return 'Choose a seed for this task.'
  if (!taskForm.title.trim()) return 'Title is required.'
  if (!taskForm.due_date) return 'Due date is required.'

  return null
}

const saveTask = async () => {
  taskFormError.value = validateTaskForm()

  if (taskFormError.value) return

  isSavingTask.value = true

  try {
    const completedAt = taskForm.status === 'completed'
      ? props.task?.completed_at ?? new Date().toISOString()
      : null
    const taskPayload: GardenSeedTaskInsert | GardenSeedTaskUpdate = {
      seed_id: taskForm.seed_id,
      title: taskForm.title.trim(),
      due_date: taskForm.due_date,
      status: taskForm.status,
      completed_at: completedAt,
      notes: cleanText(taskForm.notes)
    }
    const taskId = props.task?.id
    if (isEditing.value && taskId) {
      await $fetch(`/api/gardening/tasks/${taskId}`, {
        method: 'PUT',
        body: taskPayload
      })
    } else {
      await $fetch('/api/gardening/tasks', {
        method: 'POST',
        body: taskPayload as GardenSeedTaskInsert
      })
    }

    toast.add({
      title: isEditing.value ? 'Task updated' : 'Task added',
      description: `${taskForm.title.trim()} was ${isEditing.value ? 'updated' : 'added'}.`,
      icon: 'i-lucide-list-todo',
      color: 'success'
    })
    resetTaskForm()
    emit('saved')
  } catch (error) {
    taskFormError.value = error instanceof Error
      ? error.message
      : 'Task could not be saved.'
    toast.add({
      title: 'Task could not be saved',
      description: taskFormError.value,
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    isSavingTask.value = false
  }
}
</script>

<template>
  <UForm
    :state="taskForm"
    class="flex flex-col gap-5"
    @submit="saveTask"
  >
    <UAlert
      v-if="taskFormError"
      title="Task could not be saved"
      :description="taskFormError"
      color="error"
      icon="i-lucide-triangle-alert"
    />

    <UAlert
      v-if="!seeds.length"
      title="No seeds available"
      description="Add a seed to the catalog before creating planting tasks."
      color="warning"
      icon="i-lucide-sprout"
    />

    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField
        label="Seed"
        name="seed_id"
        required
      >
        <USelectMenu
          v-model="taskForm.seed_id"
          value-key="value"
          label-key="label"
          :items="seedOptions"
          :disabled="!seeds.length"
          :content="{ sideOffset: 4 }"
          :ui="{
            content: 'max-h-80',
            viewport: 'max-h-80 overflow-y-auto'
          }"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Due Date"
        name="due_date"
        required
      >
        <UInput
          v-model="taskForm.due_date"
          type="date"
        />
      </UFormField>

      <UFormField
        label="Title"
        name="title"
        required
        class="sm:col-span-2"
      >
        <UInput
          v-model="taskForm.title"
          placeholder="Start tomato seeds"
        />
      </UFormField>

      <UFormField
        label="Status"
        name="status"
      >
        <USelect
          v-model="taskForm.status"
          :items="gardenSeedTaskStatusItems"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Notes"
        name="notes"
        class="sm:col-span-2"
      >
        <UTextarea
          v-model="taskForm.notes"
          :rows="4"
          placeholder="Optional reminder details"
        />
      </UFormField>
    </div>

    <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <UButton
        label="Cancel"
        color="neutral"
        variant="outline"
        :disabled="isSavingTask"
        @click="emit('cancel')"
      />
      <UButton
        type="submit"
        :label="submitLabel"
        icon="i-lucide-save"
        :loading="isSavingTask"
        :disabled="!seeds.length"
      />
    </div>
  </UForm>
</template>
