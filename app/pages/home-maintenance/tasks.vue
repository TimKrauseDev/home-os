<script setup lang="ts">
import {
  formatMaintenanceCadence,
  formatMaintenanceDate
} from '~/utils/maintenanceCadence'
import type { MaintenanceCadenceType } from '~/types/maintenance-cadence'
import type {
  MaintenanceArea,
  MaintenancePriority,
  MaintenanceTaskRow,
  MaintenanceTaskStatus
} from '~/types/home-maintenance'
import { formatLabel } from '~/utils/formatters'
import { allFilterValue, pageSizeItems } from '~/utils/options/common'
import {
  maintenanceAreaFilterItems,
  maintenanceCadenceTypeFilterItems,
  maintenancePriorityFilterItems,
  maintenanceStatusFilterItems
} from '~/utils/options/homeMaintenance'

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
const selectedPriority = ref<MaintenancePriority | typeof allFilterValue>(allFilterValue)
const selectedCadenceType = ref<MaintenanceCadenceType | typeof allFilterValue>(allFilterValue)

const refreshTasks = async () => {
  isLoading.value = true
  error.value = null

  try {
    tasks.value = await $fetch<MaintenanceTaskRow[]>('/api/home-maintenance/tasks')
  } catch (refreshError) {
    error.value = refreshError instanceof Error ? refreshError.message : 'Maintenance tasks could not be loaded.'
  } finally {
    isLoading.value = false
  }
}

onMounted(refreshTasks)

const modalTitle = computed(() => selectedTask.value ? 'Edit Maintenance Task' : 'Add Maintenance Task')
const activeTasks = computed(() => tasks.value.filter(task => task.status === 'active'))
const inProgressTasks = computed(() => tasks.value.filter(task => task.status === 'in_progress'))
const interiorTasks = computed(() => tasks.value.filter(task => task.area === 'interior'))
const exteriorTasks = computed(() => tasks.value.filter(task => task.area === 'exterior'))
const filteredTasks = computed(() => {
  const query = search.value.trim().toLowerCase()

  return tasks.value.filter((task) => {
    const cadenceText = task.home_maintenance_task_cadences.map(formatMaintenanceCadence).join(' ')
    const matchesSearch = !query || [
      task.title,
      task.description,
      task.area,
      task.status,
      task.priority,
      task.notes,
      cadenceText
    ].some(value => value?.toLowerCase().includes(query))
    const matchesArea = selectedArea.value === allFilterValue || task.area === selectedArea.value
    const matchesStatus = selectedStatus.value === allFilterValue || task.status === selectedStatus.value
    const matchesPriority = selectedPriority.value === allFilterValue || task.priority === selectedPriority.value
    const matchesCadence = selectedCadenceType.value === allFilterValue
      || task.home_maintenance_task_cadences.some(cadence => cadence.cadence_type === selectedCadenceType.value)

    return matchesSearch && matchesArea && matchesStatus && matchesPriority && matchesCadence
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
  toast.add({
    title: 'Maintenance refreshed',
    description: 'Task list updated with the latest cadence details.',
    icon: 'i-lucide-refresh-cw',
    color: 'success'
  })
  await refreshTasks()
}

const updateTaskDueDate = async (task: MaintenanceTaskRow, action: 'complete' | 'skip') => {
  updatingTaskId.value = task.id

  try {
    const { nextDueDate } = await $fetch<{ nextDueDate: string }>(`/api/home-maintenance/tasks/${task.id}/due-date`, {
      method: 'PATCH',
      body: {
        action,
        notes: 'Completed from maintenance tasks.'
      }
    })

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

watch([search, selectedArea, selectedStatus, selectedPriority, selectedCadenceType, selectedPageSize], () => {
  page.value = 1
})
</script>

<template>
  <div class="flex flex-col gap-4 sm:gap-6">
    <section class="rounded-lg border border-default bg-default p-4 shadow-xs sm:p-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="min-w-0">
          <div class="flex items-center gap-2 text-sm text-muted">
            <UIcon name="i-lucide-list-checks" class="size-4" />
            <span>Maintenance Tasks</span>
          </div>
          <h1 class="mt-2 text-xl font-semibold text-highlighted">
            Maintenance Tasks
          </h1>
          <p class="mt-1 text-sm text-muted">
            Recurring care tasks with one or more cadences that default the next due date.
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
      v-model:open="isModalOpen"
      :title="modalTitle"
      :close="{ color: 'primary', variant: 'outline', class: 'rounded-full', onClick: closeModal }"
      :ui="{ content: 'sm:max-w-4xl' }"
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
          <UIcon name="i-lucide-list-checks" class="size-4" />
          <span>Active</span>
        </div>
        <p class="mt-2 text-2xl font-semibold text-highlighted">
          {{ activeTasks.length }}
        </p>
      </div>
      <div class="rounded-lg border border-default bg-default p-4 shadow-xs">
        <div class="flex items-center gap-2 text-sm text-muted">
          <UIcon name="i-lucide-sofa" class="size-4" />
          <span>Interior</span>
        </div>
        <p class="mt-2 text-2xl font-semibold text-highlighted">
          {{ interiorTasks.length }}
        </p>
      </div>
      <div class="rounded-lg border border-default bg-default p-4 shadow-xs">
        <div class="flex items-center gap-2 text-sm text-muted">
          <UIcon name="i-lucide-trees" class="size-4" />
          <span>Exterior</span>
        </div>
        <p class="mt-2 text-2xl font-semibold text-highlighted">
          {{ exteriorTasks.length }}
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
    </div>

    <UPageCard
      variant="subtle"
      :ui="{ container: 'p-0 sm:p-0 overflow-hidden' }"
    >
      <div class="grid gap-3 border-b border-default p-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_repeat(4,minmax(9rem,11rem))_10rem]">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Search maintenance"
        />
        <USelect
          v-model="selectedArea"
          :items="maintenanceAreaFilterItems"
        />
        <USelect
          v-model="selectedStatus"
          :items="maintenanceStatusFilterItems"
        />
        <USelect
          v-model="selectedPriority"
          :items="maintenancePriorityFilterItems"
        />
        <USelect
          v-model="selectedCadenceType"
          :items="maintenanceCadenceTypeFilterItems"
        />
        <USelect
          v-model="selectedPageSize"
          :items="pageSizeItems"
        />
      </div>

      <UAlert
        v-if="error"
        title="Maintenance tasks could not be loaded"
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
          No maintenance tasks match these filters.
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
