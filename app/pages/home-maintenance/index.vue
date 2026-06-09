<script setup lang="ts">
import { addDays, isBefore, isToday, parseISO } from 'date-fns'
import {
  calculateMaintenanceDueDate,
  formatMaintenanceCadence,
  formatMaintenanceDate,
  type MaintenanceCadence
} from '~/utils/maintenanceCadence'
import { createSupabaseClient } from '~/libs/supabaseClient'

type MaintenanceTaskStatus = 'active' | 'archived' | 'in_progress' | 'paused'
type MaintenancePriority = 'high' | 'low' | 'medium'
type MaintenanceArea = 'exterior' | 'interior'
type MaintenanceCadenceRow = MaintenanceCadence & {
  id: string
  notes: string | null
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
type SupabaseResult<T> = Promise<{
  data: T | null
  error: { message: string } | null
}>
type SupabaseClient = {
  from: (table: string) => {
    insert: (payload: Record<string, unknown>) => SupabaseResult<null>
    select: (columns: string) => {
      order: (column: string, options: { ascending: boolean }) => SupabaseResult<MaintenanceTaskRow[]>
    }
    update: (payload: Record<string, unknown>) => {
      eq: (column: string, value: string) => SupabaseResult<null>
    }
  }
}

const allFilterValue = 'all'
const pageSizeItems = [10, 25, 50].map(size => ({
  label: `${size} per page`,
  value: size
}))
const toast = useToast()
const tasks = ref<MaintenanceTaskRow[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const isModalOpen = ref(false)
const selectedTask = ref<MaintenanceTaskRow | null>(null)
const updatingTaskId = ref<string | null>(null)
const formResetKey = ref(0)
const search = ref('')
const selectedPageSize = ref(10)
const page = ref(1)
const selectedArea = ref<MaintenanceArea | typeof allFilterValue>(allFilterValue)
const selectedStatus = ref<MaintenanceTaskStatus | typeof allFilterValue>(allFilterValue)

const areaItems = [
  { label: 'All areas', value: allFilterValue },
  { label: 'Interior', value: 'interior' },
  { label: 'Exterior', value: 'exterior' }
] satisfies { label: string, value: MaintenanceArea | typeof allFilterValue }[]
const statusItems = [
  { label: 'All statuses', value: allFilterValue },
  { label: 'Active', value: 'active' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Paused', value: 'paused' },
  { label: 'Archived', value: 'archived' }
] satisfies { label: string, value: MaintenanceTaskStatus | typeof allFilterValue }[]

const formatLabel = (value: string | null | undefined) => {
  if (!value) return '-'

  return value.replace(/_/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase())
}

const refreshTasks = async () => {
  isLoading.value = true
  error.value = null

  try {
    const supabase = createSupabaseClient() as unknown as SupabaseClient
    const { data, error: taskError } = await supabase
      .from('home_maintenance_tasks')
      .select('*, home_maintenance_task_cadences(*)')
      .order('next_due_date', { ascending: true })

    if (taskError) throw new Error(taskError.message)

    tasks.value = data ?? []
  } catch (refreshError) {
    error.value = refreshError instanceof Error ? refreshError.message : 'Maintenance overview could not be loaded.'
  } finally {
    isLoading.value = false
  }
}

onMounted(refreshTasks)

const today = new Date()
const dueSoonTasks = computed(() => tasks.value.filter((task) => {
  if (!task.next_due_date || task.status === 'archived' || task.status === 'paused') return false

  const dueDate = parseISO(task.next_due_date)
  return isToday(dueDate) || (!isBefore(dueDate, today) && dueDate.getTime() - today.getTime() <= 14 * 24 * 60 * 60 * 1000)
}))
const overdueTasks = computed(() => tasks.value.filter((task) => {
  if (!task.next_due_date || task.status === 'archived' || task.status === 'paused') return false

  return isBefore(parseISO(task.next_due_date), today) && !isToday(parseISO(task.next_due_date))
}))
const inProgressTasks = computed(() => tasks.value.filter(task => task.status === 'in_progress'))
const upcomingTasks = computed(() => tasks.value.filter(task => task.next_due_date && !dueSoonTasks.value.includes(task) && !overdueTasks.value.includes(task)))
const filteredTasks = computed(() => {
  const query = search.value.trim().toLowerCase()

  return tasks.value.filter((task) => {
    const cadenceText = task.home_maintenance_task_cadences.map(formatMaintenanceCadence).join(' ')
    const matchesSearch = !query || [
      task.title,
      task.area,
      task.status,
      task.notes,
      cadenceText
    ].some(value => value?.toLowerCase().includes(query))
    const matchesArea = selectedArea.value === allFilterValue || task.area === selectedArea.value
    const matchesStatus = selectedStatus.value === allFilterValue || task.status === selectedStatus.value

    return matchesSearch && matchesArea && matchesStatus
  })
})
const visibleTasks = computed(() => {
  const startIndex = (page.value - 1) * selectedPageSize.value

  return filteredTasks.value.slice(startIndex, startIndex + selectedPageSize.value)
})
const resultCount = computed(() => filteredTasks.value.length)
const resultStart = computed(() => {
  if (!resultCount.value) return 0

  return (page.value - 1) * selectedPageSize.value + 1
})
const resultEnd = computed(() => Math.min(page.value * selectedPageSize.value, resultCount.value))

const modalTitle = computed(() => selectedTask.value ? 'Edit Maintenance Task' : 'Add Maintenance Task')

const getNextDueDate = (task: MaintenanceTaskRow) => {
  const fromDate = task.next_due_date
    ? addDays(parseISO(task.next_due_date), 1)
    : addDays(new Date(), 1)

  return calculateMaintenanceDueDate(task.home_maintenance_task_cadences, fromDate)
}

const updateTaskDueDate = async (task: MaintenanceTaskRow, action: 'complete' | 'skip') => {
  updatingTaskId.value = task.id

  try {
    const supabase = createSupabaseClient() as unknown as SupabaseClient
    const now = new Date().toISOString()
    const nextDueDate = getNextDueDate(task)

    if (action === 'complete') {
      const completionResponse = await supabase.from('home_maintenance_completions').insert({
        task_id: task.id,
        completed_at: now,
        notes: 'Completed from maintenance overview.'
      })

      if (completionResponse.error) throw new Error(completionResponse.error.message)
    }

    const updateResponse = await supabase
      .from('home_maintenance_tasks')
      .update({
        last_completed_at: action === 'complete' ? now : task.last_completed_at,
        next_due_date: nextDueDate || null,
        status: 'active'
      })
      .eq('id', task.id)

    if (updateResponse.error) throw new Error(updateResponse.error.message)

    toast.add({
      title: action === 'complete' ? 'Task completed' : 'Task skipped',
      description: `${task.title} moved to ${formatMaintenanceDate(nextDueDate)}.`,
      icon: action === 'complete' ? 'i-lucide-check' : 'i-lucide-forward',
      color: 'success'
    })
    await refreshTasks()
  } catch (actionError) {
    toast.add({
      title: 'Task could not be updated',
      description: actionError instanceof Error ? actionError.message : 'Try again when the database is available.',
      icon: 'i-lucide-triangle-alert',
      color: 'error'
    })
  } finally {
    updatingTaskId.value = null
  }
}

const openCreateModal = () => {
  selectedTask.value = null
  isModalOpen.value = true
}

const openEditModal = (task: MaintenanceTaskRow) => {
  selectedTask.value = task
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const resetForm = () => {
  selectedTask.value = null
  formResetKey.value += 1
}

const handleTaskSaved = async () => {
  isModalOpen.value = false
  await refreshTasks()
}

watch([search, selectedArea, selectedStatus, selectedPageSize], () => {
  page.value = 1
})
</script>

<template>
  <div class="flex flex-col gap-4 sm:gap-6">
    <section class="rounded-lg border border-default bg-default p-4 shadow-xs sm:p-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="min-w-0">
          <div class="flex items-center gap-2 text-sm text-muted">
            <UIcon name="i-lucide-wrench" class="size-4" />
            <span>Home Maintenance</span>
          </div>
          <h1 class="mt-2 text-xl font-semibold text-highlighted">
            Home Maintenance
          </h1>
          <p class="mt-1 text-sm text-muted">
            Recurring household care by monthly, seasonal, yearly, and custom cadence.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <UButton
            label="Add Task"
            icon="i-lucide-plus"
            class="w-fit"
            @click="openCreateModal"
          />
          <UButton
            label="Refresh"
            icon="i-lucide-refresh-cw"
            color="neutral"
            variant="outline"
            class="w-fit"
            :loading="isLoading"
            @click="refreshTasks"
          />
        </div>
      </div>
    </section>

    <UModal
      :open="isModalOpen"
      :title="modalTitle"
      :close="{ color: 'primary', variant: 'outline', class: 'rounded-full', onClick: closeModal }"
      :ui="{ content: 'sm:max-w-4xl' }"
      @update:open="isModalOpen = $event"
      @after:leave="resetForm"
    >
      <template #body>
        <HomeMaintenanceTaskForm
          :task="selectedTask"
          :reset-key="formResetKey"
          @cancel="closeModal"
          @saved="handleTaskSaved"
        />
      </template>
    </UModal>

    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <div class="rounded-lg border border-default bg-default p-4 shadow-xs">
        <div class="flex items-center gap-2 text-sm text-muted">
          <UIcon name="i-lucide-calendar-clock" class="size-4" />
          <span>Due Soon</span>
        </div>
        <p class="mt-2 text-2xl font-semibold text-highlighted">
          {{ dueSoonTasks.length }}
        </p>
      </div>
      <div class="rounded-lg border border-default bg-default p-4 shadow-xs">
        <div class="flex items-center gap-2 text-sm text-muted">
          <UIcon name="i-lucide-triangle-alert" class="size-4" />
          <span>Overdue</span>
        </div>
        <p class="mt-2 text-2xl font-semibold text-highlighted">
          {{ overdueTasks.length }}
        </p>
      </div>
      <div class="rounded-lg border border-default bg-default p-4 shadow-xs">
        <div class="flex items-center gap-2 text-sm text-muted">
          <UIcon name="i-lucide-loader-circle" class="size-4" />
          <span>In Progress</span>
        </div>
        <p class="mt-2 text-2xl font-semibold text-highlighted">
          {{ inProgressTasks.length }}
        </p>
      </div>
      <div class="rounded-lg border border-default bg-default p-4 shadow-xs">
        <div class="flex items-center gap-2 text-sm text-muted">
          <UIcon name="i-lucide-calendar" class="size-4" />
          <span>Upcoming</span>
        </div>
        <p class="mt-2 text-2xl font-semibold text-highlighted">
          {{ upcomingTasks.length }}
        </p>
      </div>
    </div>

    <UPageCard
      variant="subtle"
      :ui="{ container: 'p-0 sm:p-0 overflow-hidden' }"
    >
      <div class="grid gap-3 border-b border-default p-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_11rem_11rem_10rem]">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Search maintenance"
        />
        <USelect
          v-model="selectedArea"
          :items="areaItems"
        />
        <USelect
          v-model="selectedStatus"
          :items="statusItems"
        />
        <USelect
          v-model="selectedPageSize"
          :items="pageSizeItems"
        />
      </div>

      <UAlert
        v-if="error"
        title="Maintenance overview could not be loaded"
        :description="error"
        color="error"
        icon="i-lucide-triangle-alert"
        class="rounded-none border-x-0 border-t-0"
      />

      <div class="divide-y divide-default">
        <div
          v-if="isLoading"
          class="p-4 text-sm text-muted"
        >
          Loading...
        </div>

        <div
          v-else-if="!resultCount"
          class="p-4 text-sm text-muted"
        >
          No maintenance items need attention.
        </div>

        <details
          v-for="task in visibleTasks"
          v-else
          :key="task.id"
          class="group"
        >
          <summary class="grid cursor-pointer list-none grid-cols-[1fr_auto] gap-3 p-4 transition hover:bg-muted/40 [&::-webkit-details-marker]:hidden">
            <div class="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_8rem_9rem_8rem] sm:items-center">
              <div class="min-w-0">
                <p class="text-xs text-muted">
                  Task
                </p>
                <p class="truncate font-medium">
                  {{ task.title }}
                </p>
              </div>
              <div class="min-w-0">
                <p class="text-xs text-muted">
                  Status
                </p>
                <p class="truncate text-sm text-highlighted">
                  {{ formatLabel(task.status) }}
                </p>
              </div>
              <div class="min-w-0">
                <p class="text-xs text-muted">
                  Next Due
                </p>
                <p class="truncate text-sm text-highlighted">
                  {{ formatMaintenanceDate(task.next_due_date) }}
                </p>
              </div>
              <div class="min-w-0">
                <p class="text-xs text-muted">
                  Priority
                </p>
                <p class="truncate text-sm text-highlighted">
                  {{ formatLabel(task.priority) }}
                </p>
              </div>
            </div>

            <UIcon
              name="i-lucide-chevron-down"
              class="size-4 text-muted transition-transform group-open:rotate-180"
            />
          </summary>

          <div class="flex flex-col gap-4 border-t border-default px-4 py-4">
            <div class="grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
              <div>
                <p class="text-muted">
                  Area
                </p>
                <p>{{ formatLabel(task.area) }}</p>
              </div>
              <div>
                <p class="text-muted">
                  Last Completed
                </p>
                <p>{{ formatMaintenanceDate(task.last_completed_at) }}</p>
              </div>
              <div>
                <p class="text-muted">
                  Description
                </p>
                <p>{{ task.description || '-' }}</p>
              </div>
              <div>
                <p class="text-muted">
                  Notes
                </p>
                <p>{{ task.notes || '-' }}</p>
              </div>
            </div>

            <div class="text-sm">
              <p class="text-muted">
                Cadence
              </p>
              <div
                v-if="task.home_maintenance_task_cadences.length"
                class="mt-1 flex flex-col gap-1"
              >
                <span
                  v-for="cadence in task.home_maintenance_task_cadences"
                  :key="cadence.id"
                >
                  {{ formatMaintenanceCadence(cadence) }}
                </span>
              </div>
              <p v-else class="mt-1">
                -
              </p>
            </div>

            <div class="flex flex-wrap justify-end gap-2 border-t border-default pt-4">
              <UButton
                label="Edit"
                icon="i-lucide-pencil"
                color="neutral"
                variant="outline"
                size="sm"
                class="w-fit"
                :disabled="updatingTaskId === task.id"
                @click="openEditModal(task)"
              />
              <UButton
                label="Complete"
                icon="i-lucide-check"
                color="success"
                variant="outline"
                size="sm"
                class="w-fit"
                :loading="updatingTaskId === task.id"
                @click="updateTaskDueDate(task, 'complete')"
              />
              <UButton
                label="Skip"
                icon="i-lucide-forward"
                color="neutral"
                variant="outline"
                size="sm"
                class="w-fit"
                :disabled="updatingTaskId === task.id"
                @click="updateTaskDueDate(task, 'skip')"
              />
            </div>
          </div>
        </details>
      </div>

      <div
        v-if="resultCount"
        class="flex flex-col gap-3 border-t border-default p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="text-sm text-muted">
          Showing {{ resultStart }}-{{ resultEnd }} of {{ resultCount }} tasks
        </p>

        <UPagination
          v-model:page="page"
          :total="resultCount"
          :items-per-page="selectedPageSize"
          :sibling-count="1"
          size="sm"
          class="self-start sm:self-auto"
        />
      </div>
    </UPageCard>
  </div>
</template>
