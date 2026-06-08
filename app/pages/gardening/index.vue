<script setup lang="ts">
import { addDays, compareAsc, format, isAfter, isBefore, isToday, parseISO } from 'date-fns'
import type { Tables } from '../../../database/database.types'
import { createSupabaseClient } from '~/libs/supabaseClient'

type GardenSeed = Tables<'garden_seeds'>
type GardenSeedTask = Tables<'garden_seed_tasks'>
type SowingWindow = Tables<'garden_seed_sowing_windows'>
type SeedTaskRow = GardenSeedTask & {
  garden_seeds: Pick<GardenSeed, 'id' | 'type' | 'variety' | 'location_number' | 'recommended_sow_method' | 'source_image_url' | 'source_page_url'> | null
}
type SeedCatalogRow = GardenSeed & {
  garden_seed_sowing_windows: SowingWindow[]
}

const today = new Date()
const nextTwoWeeks = addDays(today, 14)

const formatDate = (date: string) => format(parseISO(date), 'MMM d')
const formatLabel = (value: string | null | undefined) => {
  if (!value) return '-'

  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase())
}
const isTaskOverdue = (task: SeedTaskRow) => task.status === 'pending' && isBefore(parseISO(task.due_date), today) && !isToday(parseISO(task.due_date))
const isTaskDueSoon = (task: SeedTaskRow) => task.status === 'pending' && !isBefore(parseISO(task.due_date), today) && !isAfter(parseISO(task.due_date), nextTwoWeeks)
const getSeedName = (seed: Pick<GardenSeed, 'type' | 'variety'> | null) => {
  if (!seed) return 'Unknown seed'

  return `${seed.variety} ${seed.type}`
}
const getRecommendedWindows = (seed: SeedCatalogRow) => {
  if (!seed.recommended_sow_method) return seed.garden_seed_sowing_windows

  return seed.garden_seed_sowing_windows.filter(window => window.sow_method === seed.recommended_sow_method)
}
const formatSowingWindow = (window: SowingWindow) => {
  const direction = formatLabel(window.sow_direction).toLowerCase()
  const reference = formatLabel(window.sow_reference).toLowerCase()

  return `${formatLabel(window.sow_method)}: ${window.sow_start_weeks}-${window.sow_end_weeks} weeks ${direction} ${reference}`
}

const { data, pending, error, refresh } = await useAsyncData('gardening-overview', async () => {
  const supabase = createSupabaseClient()
  const [tasksResponse, seedsResponse] = await Promise.all([
    supabase
      .from('garden_seed_tasks')
      .select('*, garden_seeds(id, type, variety, location_number, recommended_sow_method, source_image_url, source_page_url)')
      .order('due_date', { ascending: true })
      .limit(100),
    supabase
      .from('garden_seeds')
      .select('*, garden_seed_sowing_windows(*)')
      .order('type', { ascending: true })
      .order('variety', { ascending: true })
  ])

  if (tasksResponse.error) {
    throw createError({
      statusCode: 500,
      statusMessage: tasksResponse.error.message
    })
  }

  if (seedsResponse.error) {
    throw createError({
      statusCode: 500,
      statusMessage: seedsResponse.error.message
    })
  }

  return {
    tasks: tasksResponse.data as SeedTaskRow[],
    seeds: seedsResponse.data as SeedCatalogRow[]
  }
}, {
  default: () => ({
    tasks: [],
    seeds: []
  })
})

const pendingTasks = computed(() => data.value.tasks.filter(task => task.status === 'pending'))
const overdueTasks = computed(() => pendingTasks.value.filter(isTaskOverdue))
const dueTodayTasks = computed(() => pendingTasks.value.filter(task => isToday(parseISO(task.due_date))))
const dueSoonTasks = computed(() => pendingTasks.value.filter(isTaskDueSoon))
const completedTasks = computed(() => data.value.tasks.filter(task => task.status === 'completed'))
const seedsWithImages = computed(() => data.value.seeds.filter(seed => seed.source_image_url).length)
const seedsWithRatings = computed(() => data.value.seeds.filter(seed => seed.overall_rating).length)
const successionSeeds = computed(() => data.value.seeds.filter(seed => seed.is_succession_planted))
const deerResistantSeeds = computed(() => data.value.seeds.filter(seed => seed.is_deer_resistant))
const nextTasks = computed(() => {
  return pendingTasks.value
    .slice()
    .sort((taskA, taskB) => compareAsc(parseISO(taskA.due_date), parseISO(taskB.due_date)))
    .slice(0, 6)
})
const recentlyCompletedTasks = computed(() => {
  return completedTasks.value
    .filter(task => task.completed_at)
    .sort((taskA, taskB) => compareAsc(parseISO(taskB.completed_at ?? taskB.updated_at), parseISO(taskA.completed_at ?? taskA.updated_at)))
    .slice(0, 4)
})
const seedTypes = computed(() => [...new Set(data.value.seeds.map(seed => seed.type))].sort((typeA, typeB) => typeA.localeCompare(typeB)))
const seedTypeHighlights = computed(() => {
  return seedTypes.value.slice(0, 8).map(type => ({
    type,
    count: data.value.seeds.filter(seed => seed.type === type).length
  }))
})
const recommendedSowingSeeds = computed(() => {
  return data.value.seeds
    .filter(seed => getRecommendedWindows(seed).length)
    .slice(0, 5)
})
</script>

<template>
  <div class="flex flex-col gap-4 sm:gap-6">
    <UPageCard
      title="Gardening"
      description="Seed catalog, planting reminders, sowing windows, and quick signals for what needs attention."
      icon="i-lucide-sprout"
      variant="subtle"
    >
      <template #footer>
        <div class="flex flex-wrap gap-2">
          <UButton
            label="Seed Catalog"
            icon="i-lucide-table-properties"
            to="/gardening/seed-catalog"
          />
          <UButton
            label="Planting Tasks"
            icon="i-lucide-list-todo"
            to="/gardening/tasks"
            color="neutral"
            variant="outline"
          />
          <UButton
            label="Refresh"
            icon="i-lucide-refresh-cw"
            color="neutral"
            variant="outline"
            :loading="pending"
            @click="refresh()"
          />
        </div>
      </template>
    </UPageCard>

    <UAlert
      v-if="error"
      title="Gardening overview could not be loaded"
      :description="error.message"
      color="error"
      icon="i-lucide-triangle-alert"
    />

    <template v-else>
      <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <UPageCard title="Pending Tasks" :description="String(pendingTasks.length)" icon="i-lucide-clock" />
        <UPageCard title="Overdue" :description="String(overdueTasks.length)" icon="i-lucide-triangle-alert" />
        <UPageCard title="Due Today" :description="String(dueTodayTasks.length)" icon="i-lucide-sun" />
        <UPageCard title="Seed Catalog" :description="`${data.seeds.length} seeds`" icon="i-lucide-table-properties" />
      </div>

      <div class="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)]">
        <UPageCard
          title="Plant Soon"
          description="Pending reminders ordered by due date."
          icon="i-lucide-calendar-clock"
          variant="subtle"
          :ui="{ container: 'p-0 sm:p-0 overflow-hidden' }"
        >
          <div
            v-if="pending"
            class="p-4 text-sm text-muted"
          >
            Loading planting reminders...
          </div>
          <div
            v-else-if="!nextTasks.length"
            class="p-4 text-sm text-muted"
          >
            No pending planting reminders.
          </div>
          <div
            v-else
            class="divide-y divide-default"
          >
            <article
              v-for="task in nextTasks"
              :key="task.id"
              class="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto]"
            >
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <UBadge
                    v-if="isTaskOverdue(task)"
                    label="Overdue"
                    icon="i-lucide-triangle-alert"
                    color="error"
                    variant="subtle"
                  />
                  <UBadge
                    v-else-if="isToday(parseISO(task.due_date))"
                    label="Today"
                    icon="i-lucide-sun"
                    color="warning"
                    variant="subtle"
                  />
                  <UBadge
                    v-else-if="dueSoonTasks.some(dueSoonTask => dueSoonTask.id === task.id)"
                    label="Soon"
                    icon="i-lucide-calendar-days"
                    color="primary"
                    variant="subtle"
                  />
                  <span class="text-sm text-muted">
                    {{ formatDate(task.due_date) }}
                  </span>
                </div>
                <h2 class="mt-2 font-medium">
                  {{ task.title }}
                </h2>
                <p class="mt-1 text-sm text-muted">
                  {{ getSeedName(task.garden_seeds) }}
                  <span v-if="task.garden_seeds?.location_number">
                    · Location {{ task.garden_seeds.location_number }}
                  </span>
                </p>
              </div>
              <UButton
                label="Open"
                icon="i-lucide-arrow-right"
                color="neutral"
                variant="outline"
                size="sm"
                to="/gardening/tasks"
                class="self-start"
              />
            </article>
          </div>
        </UPageCard>

        <div class="grid gap-4">
          <UPageCard
            title="Catalog Health"
            description="Quick checks for the seed list."
            icon="i-lucide-clipboard-check"
            variant="subtle"
          >
            <div class="grid gap-3 text-sm">
              <div class="flex items-center justify-between gap-3">
                <span class="text-muted">With images</span>
                <span>{{ seedsWithImages }} / {{ data.seeds.length }}</span>
              </div>
              <div class="flex items-center justify-between gap-3">
                <span class="text-muted">Rated</span>
                <span>{{ seedsWithRatings }} / {{ data.seeds.length }}</span>
              </div>
              <div class="flex items-center justify-between gap-3">
                <span class="text-muted">Succession planted</span>
                <span>{{ successionSeeds.length }}</span>
              </div>
              <div class="flex items-center justify-between gap-3">
                <span class="text-muted">Deer resistant</span>
                <span>{{ deerResistantSeeds.length }}</span>
              </div>
            </div>
          </UPageCard>

          <UPageCard
            title="Seed Types"
            description="A compact scan of catalog coverage."
            icon="i-lucide-tags"
            variant="subtle"
          >
            <div
              v-if="!seedTypeHighlights.length"
              class="text-sm text-muted"
            >
              Add seeds to build type coverage.
            </div>
            <div
              v-else
              class="flex flex-wrap gap-2"
            >
              <UBadge
                v-for="item in seedTypeHighlights"
                :key="item.type"
                :label="`${formatLabel(item.type)} ${item.count}`"
                color="neutral"
                variant="subtle"
              />
            </div>
          </UPageCard>
        </div>
      </div>

      <div class="grid gap-4 xl:grid-cols-2">
        <UPageCard
          title="Recommended Sowing Notes"
          description="A quick reference from each seed's recommended sow method."
          icon="i-lucide-award"
          variant="subtle"
          :ui="{ container: 'p-0 sm:p-0 overflow-hidden' }"
        >
          <div
            v-if="!recommendedSowingSeeds.length"
            class="p-4 text-sm text-muted"
          >
            No recommended sowing windows yet.
          </div>
          <div
            v-else
            class="divide-y divide-default"
          >
            <article
              v-for="seed in recommendedSowingSeeds"
              :key="seed.id"
              class="p-4"
            >
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="font-medium">
                  {{ seed.variety }} {{ seed.type }}
                </h2>
                <UBadge
                  v-if="seed.recommended_sow_method"
                  :label="formatLabel(seed.recommended_sow_method)"
                  icon="i-lucide-award"
                  color="success"
                  variant="subtle"
                />
              </div>
              <ul class="mt-2 grid gap-1 text-sm text-muted">
                <li
                  v-for="window in getRecommendedWindows(seed)"
                  :key="window.id"
                >
                  {{ formatSowingWindow(window) }}
                </li>
              </ul>
            </article>
          </div>
        </UPageCard>

        <UPageCard
          title="Recently Completed"
          description="Recently finished planting reminders."
          icon="i-lucide-check"
          variant="subtle"
          :ui="{ container: 'p-0 sm:p-0 overflow-hidden' }"
        >
          <div
            v-if="!recentlyCompletedTasks.length"
            class="p-4 text-sm text-muted"
          >
            Completed planting reminders will appear here.
          </div>
          <div
            v-else
            class="divide-y divide-default"
          >
            <article
              v-for="task in recentlyCompletedTasks"
              :key="task.id"
              class="p-4"
            >
              <h2 class="font-medium">
                {{ task.title }}
              </h2>
              <p class="mt-1 text-sm text-muted">
                {{ getSeedName(task.garden_seeds) }}
                <span v-if="task.completed_at"> · {{ formatDate(task.completed_at) }}</span>
              </p>
            </article>
          </div>
        </UPageCard>
      </div>
    </template>
  </div>
</template>
