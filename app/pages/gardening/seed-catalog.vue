<script setup lang="ts">
import type { SeedCatalogRow, SowMethod } from '~/types/gardening'
import {
  formatSeedDepth,
  formatSowingWindowTiming,
  isRecommendedSowingWindow
} from '~/utils/gardening'
import { formatBoolean, formatInches, formatLabel } from '~/utils/formatters'
import { allFilterValue, pageSizeItems } from '~/utils/options/common'
import {
  seedFeatureDefinitions,
  seedFeatureFilterItems,
  sowMethodFilterItems
} from '~/utils/options/gardening'

const search = ref('')
const selectedType = ref(allFilterValue)
const selectedSowMethod = ref<SowMethod | typeof allFilterValue>(allFilterValue)
const selectedFeature = ref<(typeof seedFeatureDefinitions)[number]['value'] | typeof allFilterValue>(allFilterValue)
const selectedPageSize = ref(10)
const page = ref(1)
const isOpen = ref(false)
const formResetKey = ref(0)
const selectedSeed = ref<SeedCatalogRow | null>(null)
const modalTitle = computed(() => selectedSeed.value ? 'Edit Seed' : 'Add Seed')
const modalDescription = computed(() => selectedSeed.value
  ? 'Update this seed catalog entry and its frost-relative sowing windows.'
  : 'Add a seed catalog entry and optional frost-relative sowing windows.')

const { data: seeds, pending, error, refresh } = await useAsyncData('garden-seed-catalog', () => $fetch<SeedCatalogRow[]>('/api/gardening/seeds'), {
  default: () => []
})

const seedCount = computed(() => seeds.value.length)
const typeItems = computed(() => {
  const types = [...new Set(seeds.value.map(seed => seed.type))]
    .sort((typeA, typeB) => typeA.localeCompare(typeB))

  return [
    { label: 'All types', value: allFilterValue },
    ...types.map(type => ({
      label: formatLabel(type),
      value: type
    }))
  ]
})
const filteredSeeds = computed(() => {
  const query = search.value.trim().toLowerCase()

  return seeds.value.filter((seed) => {
    const matchesSearch = !query || [
      seed.location_number,
      seed.type,
      seed.variety,
      seed.purchased_from,
      seed.source_page_url,
      seed.notes
    ].some(value => value?.toLowerCase().includes(query))
    const matchesType = selectedType.value === allFilterValue || seed.type === selectedType.value
    const matchesSowMethod = selectedSowMethod.value === allFilterValue || seed.recommended_sow_method === selectedSowMethod.value
    const matchesFeature = selectedFeature.value === allFilterValue
      || seedFeatureDefinitions.some(feature => feature.value === selectedFeature.value && feature.matches(seed))

    return matchesSearch && matchesType && matchesSowMethod && matchesFeature
  })
})
const visibleSeeds = computed(() => {
  const startIndex = (page.value - 1) * selectedPageSize.value

  return filteredSeeds.value.slice(startIndex, startIndex + selectedPageSize.value)
})
const resultCount = computed(() => filteredSeeds.value.length)
const resultStart = computed(() => {
  if (!resultCount.value) return 0

  return (page.value - 1) * selectedPageSize.value + 1
})
const resultEnd = computed(() => Math.min(page.value * selectedPageSize.value, resultCount.value))

watch([search, selectedType, selectedSowMethod, selectedFeature, selectedPageSize], () => {
  page.value = 1
})

const openCreateSeedModal = () => {
  selectedSeed.value = null
  isOpen.value = true
}

const openEditSeedModal = (seed: SeedCatalogRow) => {
  selectedSeed.value = seed
  isOpen.value = true
}

const closeCreateSeedModal = () => {
  isOpen.value = false
}

const resetCreateSeedForm = () => {
  selectedSeed.value = null
  formResetKey.value += 1
}

const handleSeedSaved = () => {
  isOpen.value = false
  void refresh()
}
</script>

<template>
  <div class="flex flex-col gap-4 sm:gap-6">
    <UPageCard
      title="Seed Catalog"
      description="Seed varieties, sowing guidance, growing details, ratings, and source notes."
      icon="i-lucide-table-properties"
      variant="subtle"
    >
      <template #footer>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="text-sm text-muted">
            {{ seedCount }} seeds
          </div>

          <div class="flex flex-wrap gap-2">
            <UButton
              label="Add Seed"
              icon="i-lucide-plus"
              class="w-fit"
              @click=" openCreateSeedModal "
            />
            <UButton
              label="Refresh"
              icon="i-lucide-refresh-cw"
              color="neutral"
              variant="outline"
              :loading=" pending "
              class="w-fit"
              @click="refresh()"
            />
          </div>
        </div>
      </template>
    </UPageCard>

    <UModal
      v-model:open="isOpen"
      :title=" modalTitle "
      :description=" modalDescription "
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full',
        onClick: closeCreateSeedModal
      }"
      :ui=" { content: 'sm:max-w-4xl' } "
      @after:leave=" resetCreateSeedForm "
    >
      <template #body>
        <GardenSeedForm
          :seed=" selectedSeed "
          :reset-key=" formResetKey "
          @cancel=" closeCreateSeedModal "
          @saved=" handleSeedSaved "
        />
      </template>
    </UModal>

    <UAlert
      v-if="error"
      title="Seed catalog could not be loaded"
      :description=" error.message "
      color="error"
      icon="i-lucide-triangle-alert"
    />

    <UPageCard
      v-else
      variant="subtle"
      :ui=" { container: 'p-0 sm:p-0 overflow-hidden' } "
    >
      <div class="grid gap-3 border-b border-default p-4 md:grid-cols-2 xl:grid-cols-[1fr_11rem_11rem_11rem_10rem]">
        <UInput
          v-model=" search "
          placeholder="Search seeds"
          icon="i-lucide-search"
        />

        <USelect
          v-model=" selectedType "
          :items=" typeItems "
        />

        <USelect
          v-model=" selectedSowMethod "
          :items=" sowMethodFilterItems "
        />

        <USelect
          v-model=" selectedFeature "
          :items=" seedFeatureFilterItems "
        />

        <USelect
          v-model=" selectedPageSize "
          :items=" pageSizeItems "
        />
      </div>

      <div class="divide-y divide-default">
        <div
          v-if="pending"
          class="p-4 text-sm text-muted"
        >
          Loading seeds...
        </div>

        <div
          v-else-if="!resultCount"
          class="p-4 text-sm text-muted"
        >
          No seeds match these filters.
        </div>

        <details
          v-for="seed in visibleSeeds"
          v-else
          :key=" seed.id "
          class="group"
        >
          <summary
            class="grid cursor-pointer list-none grid-cols-[1fr_auto] gap-3 p-4 transition hover:bg-muted/40 [&::-webkit-details-marker]:hidden"
          >
            <div class="grid min-w-0 gap-2 sm:grid-cols-[7rem_8rem_minmax(0,1fr)] sm:items-center">
              <div class="min-w-0">
                <p class="text-xs text-muted">
                  Location
                </p>
                <p class="truncate text-sm text-highlighted">
                  {{ seed.location_number ?? 'No location' }}
                </p>
              </div>
              <div class="min-w-0">
                <p class="text-xs text-muted">
                  Type
                </p>
                <p class="truncate text-sm capitalize text-highlighted">
                  {{ seed.type }}
                </p>
              </div>
              <div class="min-w-0">
                <p class="text-xs text-muted">
                  Variety
                </p>
                <div
                  class="flex min-w-0 flex-wrap items-center gap-1.5"
                >
                  <span class="truncate font-medium">
                    {{ seed.variety }}
                  </span>
                  <UBadge
                    v-for="feature in seedFeatureDefinitions.filter(feature => feature.matches(seed))"
                    :key=" feature.value "
                    :icon=" feature.icon "
                    :color=" feature.color "
                    variant="subtle"
                    size="sm"
                    :aria-label=" feature.label "
                    :title=" feature.label "
                    square
                  />
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div>
                <p class="text-xs text-muted">
                  Rating
                </p>
                <div
                  v-if="seed.overall_rating"
                  class="flex items-center gap-0.5"
                  :aria-label=" `${seed.overall_rating} out of 5 stars` "
                >
                  <UIcon
                    v-for="ratingIndex in 5"
                    :key=" ratingIndex "
                    name="i-lucide-star"
                    class="size-4"
                    :class=" ratingIndex <= seed.overall_rating ? 'fill-warning text-warning' : 'text-muted' "
                  />
                </div>
                <span
                  v-else
                  class="text-sm text-muted"
                >
                  No rating
                </span>
              </div>

              <UIcon
                name="i-lucide-chevron-down"
                class="size-4 text-muted transition-transform group-open:rotate-180"
              />
            </div>
          </summary>

          <div class="flex flex-col gap-4 border-t border-default px-4 py-4">
            <div class="flex justify-end">
              <UButton
                label="Edit"
                icon="i-lucide-pencil"
                color="neutral"
                variant="outline"
                size="sm"
                @click="openEditSeedModal(seed)"
              />
            </div>

            <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div>
                <p class="text-sm text-muted">
                  Recommended Sow
                </p>
                <p>{{ formatLabel(seed.recommended_sow_method) }}</p>
              </div>
              <div>
                <p class="text-sm text-muted">
                  Sun
                </p>
                <p>{{ formatLabel(seed.sun_type) }}</p>
              </div>
              <div>
                <p class="text-sm text-muted">
                  Seed Depth
                </p>
                <p>{{ formatSeedDepth(seed.seed_depth_inches) }}</p>
              </div>
              <div>
                <p class="text-sm text-muted">
                  Row Spacing
                </p>
                <p>{{ formatInches(seed.row_spacing_inches) }}</p>
              </div>
              <div>
                <p class="text-sm text-muted">
                  Days To Emerge
                </p>
                <p>{{ seed.days_to_emerge ?? '-' }}</p>
              </div>
              <div>
                <p class="text-sm text-muted">
                  Days To Maturity
                </p>
                <p>{{ seed.days_to_maturity ?? '-' }}</p>
              </div>
              <div>
                <p class="text-sm text-muted">
                  Deer Resistant
                </p>
                <p>{{ formatBoolean(seed.is_deer_resistant) }}</p>
              </div>
              <div>
                <p class="text-sm text-muted">
                  Succession
                </p>
                <p>
                  {{ seed.is_succession_planted ? 'Yes' : 'No' }}
                  <span v-if="seed.succession_interval_days">
                    every {{ seed.succession_interval_days }} days
                  </span>
                </p>
              </div>
            </div>

            <div class="text-sm">
              <p class="text-muted">
                Sowing Windows
              </p>
              <p
                v-if="!seed.garden_seed_sowing_windows.length"
                class="mt-1"
              >
                -
              </p>
              <ul
                v-else
                class="mt-1 flex flex-col gap-2"
              >
                <li
                  v-for="window in seed.garden_seed_sowing_windows"
                  :key=" window.id "
                  class="flex flex-col gap-1 sm:flex-row sm:items-center"
                >
                  <span>
                    <span class="font-medium">{{ formatLabel(window.sow_method) }}</span>:
                    {{ formatSowingWindowTiming(window) }}
                  </span>
                  <UBadge
                    v-if="isRecommendedSowingWindow(seed, window)"
                    icon="i-lucide-award"
                    color="success"
                    variant="subtle"
                    size="sm"
                    aria-label="Recommended sowing window"
                    title="Recommended sowing window"
                    square
                  />
                </li>
              </ul>
            </div>

            <div
              v-if="seed.purchased_from || seed.source_page_url || seed.notes || seed.source_image_url"
              class="grid gap-4 text-sm md:grid-cols-[minmax(0,1fr)_14rem]"
            >
              <div>
                <p v-if="seed.purchased_from">
                  <span class="text-muted">Purchased from: </span>
                  <ULink
                    v-if="seed.source_page_url"
                    :to=" seed.source_page_url "
                    target="_blank"
                    class="break-all"
                  >{{ seed.purchased_from }}</ULink>
                  <span v-else>{{ seed.purchased_from }}</span>
                </p>
                <p v-if="seed.notes" class="mt-4">
                  <span class="text-muted">Notes:</span><br>{{ seed.notes }}
                </p>
              </div>

              <a
                v-if="seed.source_image_url && seed.source_page_url"
                :href=" seed.source_page_url "
                target="_blank"
                rel="noopener noreferrer"
                class="block overflow-hidden rounded-md border border-default bg-muted"
              >
                <img
                  :src=" seed.source_image_url "
                  :alt=" `${seed.variety} ${seed.type}` "
                  loading="lazy"
                  decoding="async"
                  class="aspect-square w-full object-cover"
                >
                <span class="flex items-center gap-1 px-3 py-2 text-xs text-muted">
                  <UIcon
                    name="i-lucide-external-link"
                    class="size-3"
                  />
                  Source page
                </span>
              </a>

              <div
                v-else-if="seed.source_image_url"
                class="block overflow-hidden rounded-md border border-default bg-muted"
              >
                <img
                  :src=" seed.source_image_url "
                  :alt=" `${seed.variety} ${seed.type}` "
                  loading="lazy"
                  decoding="async"
                  class="aspect-square w-full object-cover"
                >
                <span class="flex items-center gap-1 px-3 py-2 text-xs text-muted">
                  Cached image
                </span>
              </div>
            </div>
          </div>
        </details>
      </div>

      <div
        v-if="resultCount"
        class="flex flex-col gap-3 border-t border-default p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="text-sm text-muted">
          Showing {{ resultStart }}-{{ resultEnd }} of {{ resultCount }} seeds
        </p>

        <UPagination
          v-model:page=" page "
          :total=" resultCount "
          :items-per-page=" selectedPageSize "
          :sibling-count=" 1 "
          size="sm"
          class="self-start sm:self-auto"
        />
      </div>
    </UPageCard>
  </div>
</template>
