<script setup lang="ts">
import { compareAsc, format, isAfter, isBefore, isToday, parseISO } from 'date-fns'
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Enums, Tables } from '../../../database/database.types'
import { createSupabaseClient } from '~/libs/supabaseClient'

type GardenSeed = Pick<Tables<'garden_seeds'>, 'id' | 'type' | 'variety' | 'location_number' | 'recommended_sow_method' | 'source_image_url' | 'source_page_url'>
type GardenSeedTask = Tables<'garden_seed_tasks'>
type TaskStatus = Enums<'garden_seed_task_status'>
type TaskRow = GardenSeedTask & {
  garden_seeds: GardenSeed | null
}

const allFilterValue = 'all'
const today = new Date()
const toast = useToast()

const selectedStatus = ref<TaskStatus | typeof allFilterValue>(allFilterValue)
const selectedWindow = ref<'active' | 'all' | 'upcoming' | 'overdue' | 'completed'>('all')
const isUpdatingTaskId = ref<string | null>(null)
const isTaskModalOpen = ref(false)
const selectedTask = ref<TaskRow | null>(null)
const taskFormResetKey = ref(0)

const statusItems = [
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Skipped', value: 'skipped' },
  { label: 'Canceled', value: 'canceled' },
  { label: 'All statuses', value: allFilterValue }
]
const windowItems = [
  { label: 'Active', value: 'active' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Completed', value: 'completed' },
  { label: 'All tasks', value: 'all' }
]
const statusMeta = {
  pending: {
    label: 'Pending',
    color: 'warning',
    icon: 'i-lucide-clock'
  },
  completed: {
    label: 'Completed',
    color: 'success',
    icon: 'i-lucide-check'
  },
  skipped: {
    label: 'Skipped',
    color: 'neutral',
    icon: 'i-lucide-forward'
  },
  canceled: {
    label: 'Canceled',
    color: 'error',
    icon: 'i-lucide-circle-x'
  }
} as const

const tasks = ref<TaskRow[]>([])
const seeds = ref<GardenSeed[]>([])
const pending = ref(false)
const error = ref<Error | null>(null)

const refreshSeeds = async () => {
  const supabase = createSupabaseClient()
  const { data, error: seedError } = await supabase
    .from('garden_seeds')
    .select('id, type, variety, location_number, recommended_sow_method, source_image_url, source_page_url')
    .order('type', { ascending: true })
    .order('variety', { ascending: true })

  if (seedError) throw seedError

  seeds.value = data as GardenSeed[]
}

const refresh = async () => {
  pending.value = true
  error.value = null

  const supabase = createSupabaseClient()

  try {
    const { data, error: taskError } = await supabase
      .from('garden_seed_tasks')
      .select('*, garden_seeds(id, type, variety, location_number, recommended_sow_method, source_image_url, source_page_url)')
      .order('due_date', { ascending: true })
      .order('created_at', { ascending: true })

    if (taskError) throw taskError

    tasks.value = data as TaskRow[]
  } catch (refreshError) {
    error.value = refreshError instanceof Error
      ? refreshError
      : new Error('Planting tasks could not be loaded.')
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  void refresh()
  void refreshSeeds().catch((seedError) => {
    toast.add({
      title: 'Seed options could not be loaded',
      description: seedError instanceof Error ? seedError.message : 'Add/edit task seed choices are unavailable.',
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  })
})

const formatDate = (date: string) => format(parseISO(date), 'MMM d, yyyy')
const formatLabel = (value: string | null | undefined) => {
  if (!value) return '-'

  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase())
}
const isTaskOverdue = (task: TaskRow) => task.status === 'pending' && isBefore(parseISO(task.due_date), today) && !isToday(parseISO(task.due_date))
const isTaskUpcoming = (task: TaskRow) => task.status === 'pending' && (isAfter(parseISO(task.due_date), today) || isToday(parseISO(task.due_date)))
const getDueTone = (task: TaskRow) => {
  if (task.status !== 'pending') return 'text-muted'
  if (isTaskOverdue(task)) return 'text-error'
  if (isToday(parseISO(task.due_date))) return 'text-warning'

  return 'text-muted'
}
const getTaskSeedName = (task: TaskRow) => {
  if (!task.garden_seeds) return 'Unknown seed'

  return `${task.garden_seeds.variety} ${task.garden_seeds.type}`
}

const taskStats = computed(() => {
  const pendingTasks = tasks.value.filter(task => task.status === 'pending')

  return {
    pending: pendingTasks.length,
    overdue: pendingTasks.filter(isTaskOverdue).length,
    dueToday: pendingTasks.filter(task => isToday(parseISO(task.due_date))).length,
    completed: tasks.value.filter(task => task.status === 'completed').length
  }
})
const taskStatCards = computed(() => [
  {
    label: 'Pending',
    value: String(taskStats.value.pending),
    icon: 'i-lucide-clock'
  },
  {
    label: 'Overdue',
    value: String(taskStats.value.overdue),
    icon: 'i-lucide-triangle-alert'
  },
  {
    label: 'Due Today',
    value: String(taskStats.value.dueToday),
    icon: 'i-lucide-sun'
  },
  {
    label: 'Completed',
    value: String(taskStats.value.completed),
    icon: 'i-lucide-check'
  }
])
const isRefreshingTasks = computed(() => pending.value)
const taskModalTitle = computed(() => selectedTask.value ? 'Edit Planting Task' : 'Add Planting Task')
const taskModalDescription = computed(() => selectedTask.value
  ? 'Update this planting reminder.'
  : 'Create a planting reminder for a seed in the catalog.')
const showLoadingTasks = computed(() => isRefreshingTasks.value && !tasks.value.length)
const filteredTasks = computed(() => {
  return tasks.value
    .filter((task) => {
      const matchesStatus = selectedStatus.value === allFilterValue || task.status === selectedStatus.value
      const matchesWindow = selectedWindow.value === 'all'
        || (selectedWindow.value === 'active' && task.status === 'pending')
        || (selectedWindow.value === 'overdue' && isTaskOverdue(task))
        || (selectedWindow.value === 'upcoming' && isTaskUpcoming(task))
        || (selectedWindow.value === 'completed' && task.status === 'completed')

      return matchesStatus && matchesWindow
    })
    .sort((taskA, taskB) => compareAsc(parseISO(taskA.due_date), parseISO(taskB.due_date)))
})
const groupedTasks = computed(() => {
  const groups = [
    {
      title: 'Overdue',
      icon: 'i-lucide-triangle-alert',
      tasks: filteredTasks.value.filter(isTaskOverdue)
    },
    {
      title: 'Today',
      icon: 'i-lucide-sun',
      tasks: filteredTasks.value.filter(task => task.status === 'pending' && isToday(parseISO(task.due_date)))
    },
    {
      title: 'Upcoming',
      icon: 'i-lucide-calendar-days',
      tasks: filteredTasks.value.filter(task => task.status === 'pending' && isAfter(parseISO(task.due_date), today) && !isToday(parseISO(task.due_date)))
    },
    {
      title: 'Done or Inactive',
      icon: 'i-lucide-archive',
      tasks: filteredTasks.value.filter(task => task.status !== 'pending')
    }
  ]

  return groups.filter(group => group.tasks.length)
})

const getTaskActionItems = (task: TaskRow): DropdownMenuItem[][] => {
  const statusItems: DropdownMenuItem[] = []

  if (task.status !== 'completed') {
    statusItems.push({
      label: 'Complete',
      icon: 'i-lucide-check',
      disabled: isUpdatingTaskId.value === task.id,
      onSelect: () => updateTaskStatus(task, 'completed')
    })
  }

  if (task.status !== 'pending') {
    statusItems.push({
      label: 'Reopen',
      icon: 'i-lucide-rotate-ccw',
      disabled: isUpdatingTaskId.value === task.id,
      onSelect: () => updateTaskStatus(task, 'pending')
    })
  }

  if (task.status === 'pending') {
    statusItems.push({
      label: 'Skip',
      icon: 'i-lucide-forward',
      disabled: isUpdatingTaskId.value === task.id,
      onSelect: () => updateTaskStatus(task, 'skipped')
    })
  }

  return [[{
    label: 'Edit',
    icon: 'i-lucide-pencil',
    disabled: isUpdatingTaskId.value === task.id,
    onSelect: () => openEditTaskModal(task)
  }], statusItems]
}

const openCreateTaskModal = () => {
  selectedTask.value = null
  isTaskModalOpen.value = true
}

const openEditTaskModal = (task: TaskRow) => {
  selectedTask.value = task
  isTaskModalOpen.value = true
}

const closeTaskModal = () => {
  isTaskModalOpen.value = false
}

const handleTaskModalOpenChange = (open: boolean) => {
  isTaskModalOpen.value = open
}

const resetTaskForm = () => {
  selectedTask.value = null
  taskFormResetKey.value += 1
}

const handleTaskSaved = () => {
  isTaskModalOpen.value = false
  void refresh()
}

const updateTaskStatus = async (task: TaskRow, status: TaskStatus) => {
  isUpdatingTaskId.value = task.id

  try {
    const supabase = createSupabaseClient()
    const { error } = await supabase
      .from('garden_seed_tasks')
      .update({
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : null
      })
      .eq('id', task.id)

    if (error) throw error

    toast.add({
      title: status === 'completed' ? 'Task completed' : 'Task updated',
      description: `${task.title} is now ${formatLabel(status).toLowerCase()}.`,
      icon: statusMeta[status].icon,
      color: statusMeta[status].color
    })
    await refresh()
  } catch (error) {
    toast.add({
      title: 'Task could not be updated',
      description: error instanceof Error ? error.message : 'Try again when the database connection is available.',
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    isUpdatingTaskId.value = null
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 sm:gap-6">
    <section class="rounded-lg border border-default bg-default p-4 shadow-xs sm:p-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="min-w-0">
          <div class="flex items-center gap-2 text-sm text-muted">
            <UIcon
              name="i-lucide-list-todo"
              class="size-4"
            />
            <span>Gardening</span>
          </div>
          <h1 class="mt-2 text-xl font-semibold text-highlighted">
            Planting Tasks
          </h1>
          <p class="mt-1 text-sm text-muted">
            A working list of upcoming sowing reminders and succession planting follow-ups.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-inverted transition hover:bg-primary/90"
            @click="openCreateTaskModal"
          >
            <UIcon
              name="i-lucide-plus"
              class="size-4"
            />
            Add Task
          </button>
          <NuxtLink
            to="/gardening/seed-catalog"
            class="inline-flex h-9 items-center gap-2 rounded-md border border-default px-3 text-sm font-medium text-highlighted transition hover:bg-muted"
          >
            <UIcon
              name="i-lucide-table-properties"
              class="size-4"
            />
            Seed Catalog
          </NuxtLink>
          <button
            type="button"
            class="inline-flex h-9 items-center gap-2 rounded-md border border-default px-3 text-sm font-medium text-highlighted transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isRefreshingTasks"
            @click="refresh()"
          >
            <UIcon
              :name="isRefreshingTasks ? 'i-lucide-loader-circle' : 'i-lucide-refresh-cw'"
              class="size-4"
              :class="{ 'animate-spin': isRefreshingTasks }"
            />
            Refresh
          </button>
        </div>
      </div>
    </section>

    <UModal
      :open="isTaskModalOpen"
      :title="taskModalTitle"
      :description="taskModalDescription"
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full',
        onClick: closeTaskModal
      }"
      :ui="{ content: 'sm:max-w-2xl' }"
      @update:open="handleTaskModalOpenChange"
      @after:leave="resetTaskForm"
    >
      <template #body>
        <GardenSeedTaskForm
          :task="selectedTask"
          :seeds="seeds"
          :reset-key="taskFormResetKey"
          @cancel="closeTaskModal"
          @saved="handleTaskSaved"
        />
      </template>
    </UModal>

    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="stat in taskStatCards"
        :key="stat.label"
        class="rounded-lg border border-default bg-default p-4 shadow-xs"
      >
        <div class="flex items-center gap-2 text-sm text-muted">
          <UIcon
            :name="stat.icon"
            class="size-4"
          />
          <span>{{ stat.label }}</span>
        </div>
        <p class="mt-2 text-2xl font-semibold text-highlighted">
          {{ stat.value }}
        </p>
      </div>
    </div>

    <section
      class="overflow-hidden rounded-lg border border-default bg-default shadow-xs"
    >
      <div class="grid gap-3 border-b border-default p-4 md:grid-cols-[12rem_12rem_1fr]">
        <select
          v-model="selectedWindow"
          class="h-9 rounded-md border border-default bg-default px-3 text-sm text-highlighted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          aria-label="Task window"
        >
          <option
            v-for="item in windowItems"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </option>
        </select>
        <select
          v-model="selectedStatus"
          class="h-9 rounded-md border border-default bg-default px-3 text-sm text-highlighted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          aria-label="Task status"
        >
          <option
            v-for="item in statusItems"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </option>
        </select>
        <p class="self-center text-sm text-muted md:text-right">
          {{ filteredTasks.length }} tasks
        </p>
      </div>

      <div
        v-if="error"
        class="border-b border-error/30 bg-error/10 p-4 text-sm text-error"
      >
        <div class="flex gap-2">
          <UIcon
            name="i-lucide-triangle-alert"
            class="mt-0.5 size-4 shrink-0"
          />
          <div>
            <p class="font-medium">
              Planting tasks could not be loaded
            </p>
            <p class="mt-1">
              {{ error.message }}
            </p>
          </div>
        </div>
      </div>

      <div
        v-else-if="showLoadingTasks"
        class="p-4 text-sm text-muted"
      >
        Loading planting tasks...
      </div>

      <div
        v-else-if="!filteredTasks.length"
        class="p-4 text-sm text-muted"
      >
        No planting tasks match these filters.
      </div>

      <div
        v-else
        class="divide-y divide-default"
      >
        <div
          v-for="group in groupedTasks"
          :key="group.title"
          class="p-4"
        >
          <div class="mb-3 flex items-center gap-2">
            <UIcon :name="group.icon" class="size-4 text-muted" />
            <h2 class="text-sm font-medium">
              {{ group.title }}
            </h2>
            <UBadge :label="String(group.tasks.length)" color="neutral" variant="subtle" />
          </div>

          <div class="grid gap-3">
            <article
              v-for="task in group.tasks"
              :key="task.id"
              class="grid gap-3 rounded-md border border-default p-3 md:grid-cols-[minmax(0,1fr)_auto]"
            >
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <UBadge
                    :label="statusMeta[task.status].label"
                    :icon="statusMeta[task.status].icon"
                    :color="statusMeta[task.status].color"
                    variant="subtle"
                  />
                  <span class="text-sm text-muted">
                    {{ getTaskSeedName(task) }}
                  </span>
                </div>

                <h3 class="mt-2 font-medium">
                  {{ task.title }}
                </h3>
                <p
                  class="mt-1 text-sm"
                  :class="getDueTone(task)"
                >
                  Due {{ formatDate(task.due_date) }}
                </p>
                <p
                  v-if="task.garden_seeds?.location_number || task.garden_seeds?.recommended_sow_method"
                  class="mt-1 text-sm text-muted"
                >
                  <span v-if="task.garden_seeds.location_number">Location {{ task.garden_seeds.location_number }}</span>
                  <span v-if="task.garden_seeds.location_number && task.garden_seeds.recommended_sow_method"> / </span>
                  <span v-if="task.garden_seeds.recommended_sow_method">{{ formatLabel(task.garden_seeds.recommended_sow_method) }}</span>
                </p>
                <p
                  v-if="task.notes"
                  class="mt-2 text-sm text-muted"
                >
                  {{ task.notes }}
                </p>
              </div>

              <div class="flex items-start justify-start self-start md:justify-end">
                <UDropdownMenu
                  :items="getTaskActionItems(task)"
                  :content="{ align: 'end' }"
                  class="w-fit self-start"
                >
                  <button
                    type="button"
                    class="grid size-8 shrink-0 place-items-center rounded-md text-muted transition hover:bg-muted hover:text-highlighted disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="isUpdatingTaskId === task.id"
                    :aria-label="`Actions for ${task.title}`"
                  >
                    <UIcon
                      :name="isUpdatingTaskId === task.id ? 'i-lucide-loader-circle' : 'i-lucide-ellipsis'"
                      class="size-4"
                      :class="{ 'animate-spin': isUpdatingTaskId === task.id }"
                    />
                  </button>
                </UDropdownMenu>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
