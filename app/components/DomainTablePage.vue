<script setup lang="ts">
import type { DomainStatCard, DomainTableField, DomainTableFilter, DomainTableOrder, DomainTableRecord } from '~/types/domain-table'

const props = defineProps<{
  title: string
  description: string
  icon: string
  addLabel: string
  emptyLabel: string
  fields: readonly DomainTableField[]
  filters?: readonly DomainTableFilter[]
  initialRecords?: readonly DomainTableRecord[]
  orderBy?: DomainTableOrder
  stats?: DomainStatCard[]
  tableName?: string
}>()

const {
  closeModal,
  fields: hydratedFields,
  fetchRecords,
  form,
  formatFieldValue,
  isOpen,
  isLoading,
  isSaving,
  modalTitle,
  openCreateModal,
  openEditModal,
  records,
  saveRecord,
  tableFields
} = useEditableRecords(props)

const allFilterValue = 'all'
const pageSizeItems = [10, 25, 50].map(size => ({
  label: `${size} per page`,
  value: size
}))
const search = ref('')
const activeFilters = reactive<Record<string, string>>({})
const selectedPageSize = ref(10)
const page = ref(1)
const filterFields = computed(() => hydratedFields.value.filter(field => field.options?.length))
const summaryFields = computed(() => tableFields.value.slice(0, 4))
const primaryField = computed(() => summaryFields.value[0])
const detailFields = computed(() => {
  const summaryKeys = new Set(summaryFields.value.map(field => field.key))

  return hydratedFields.value.filter(field => !summaryKeys.has(field.key))
})
const expandedRecordId = ref<string | null>(null)

watch(filterFields, (fields) => {
  for (const field of fields) {
    activeFilters[field.key] ??= allFilterValue
  }
}, { immediate: true })

const filteredRecords = computed(() => {
  const query = search.value.trim().toLowerCase()

  return records.value.filter((record) => {
    const matchesSearch = !query || hydratedFields.value.some((field) => {
      const value = formatFieldValue(record[field.key], field)

      return value.toLowerCase().includes(query)
    })
    const matchesFilters = filterFields.value.every((field) => {
      const filterValue = activeFilters[field.key] ?? allFilterValue

      return filterValue === allFilterValue || String(record[field.key] ?? '') === filterValue
    })

    return matchesSearch && matchesFilters
  })
})
const visibleRecords = computed(() => {
  const startIndex = (page.value - 1) * selectedPageSize.value

  return filteredRecords.value.slice(startIndex, startIndex + selectedPageSize.value)
})
const resultCount = computed(() => filteredRecords.value.length)
const resultStart = computed(() => {
  if (!resultCount.value) return 0

  return (page.value - 1) * selectedPageSize.value + 1
})
const resultEnd = computed(() => Math.min(page.value * selectedPageSize.value, resultCount.value))

watch([search, selectedPageSize], () => {
  page.value = 1
})

watch(activeFilters, () => {
  page.value = 1
})
</script>

<template>
  <div class="flex flex-col gap-4 sm:gap-6">
    <section class="rounded-lg border border-default bg-default p-4 shadow-xs sm:p-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="min-w-0">
          <div class="flex items-center gap-2 text-sm text-muted">
            <UIcon :name="icon" class="size-4" />
            <span>{{ title }}</span>
          </div>
          <h1 class="mt-2 text-xl font-semibold text-highlighted">
            {{ title }}
          </h1>
          <p class="mt-1 text-sm text-muted">
            {{ description }}
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <UButton
            :label="addLabel"
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
            @click="fetchRecords"
          />
        </div>
      </div>
    </section>

    <UModal
      :open="isOpen"
      :title="modalTitle"
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full',
        onClick: closeModal
      }"
      :ui="{ content: 'sm:max-w-3xl' }"
      @update:open="isOpen = $event"
    >
      <template #body>
        <form class="grid gap-4" @submit.prevent="saveRecord">
          <div class="grid gap-4 sm:grid-cols-2">
            <UFormField
              v-for="field in hydratedFields"
              :key="field.key"
              :label="field.label"
              :name="field.key"
              :required="field.required"
              :class="{ 'sm:col-span-2': field.type === 'textarea' }"
            >
              <UTextarea
                v-if="field.type === 'textarea'"
                v-model="form[field.key] as string"
                :rows="4"
              />
              <UInputNumber
                v-else-if="field.type === 'number'"
                v-model="form[field.key] as number | null"
              />
              <UCheckbox
                v-else-if="field.type === 'checkbox'"
                v-model="form[field.key] as boolean"
                :label="field.label"
              />
              <select
                v-else-if="field.type === 'select'"
                v-model="form[field.key]"
                class="h-9 w-full rounded-md border border-default bg-default px-3 text-sm text-highlighted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option
                  v-for="option in field.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <UInput
                v-else
                v-model="form[field.key] as string"
                :type="field.type === 'date' ? 'date' : 'text'"
              />
            </UFormField>
          </div>

          <div class="flex flex-col-reverse gap-2 border-t border-default pt-4 sm:flex-row sm:justify-end">
            <UButton
              label="Cancel"
              color="neutral"
              variant="outline"
              type="button"
              @click="closeModal"
            />
            <UButton
              :label="isSaving ? 'Saving' : 'Save'"
              icon="i-lucide-save"
              type="submit"
              :loading="isSaving"
            />
          </div>
        </form>
      </template>
    </UModal>

    <div v-if="stats?.length" class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-lg border border-default bg-default p-4 shadow-xs"
      >
        <div class="flex items-center gap-2 text-sm text-muted">
          <UIcon :name="stat.icon" class="size-4" />
          <span>{{ stat.label }}</span>
        </div>
        <p class="mt-2 text-2xl font-semibold text-highlighted">
          {{ stat.value }}
        </p>
      </div>
    </div>

    <UPageCard
      variant="subtle"
      :ui="{ container: 'p-0 sm:p-0 overflow-hidden' }"
    >
      <div class="grid gap-3 border-b border-default p-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_repeat(3,11rem)_10rem]">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Search table"
        />

        <USelect
          v-for="field in filterFields"
          :key="field.key"
          v-model="activeFilters[field.key]"
          :items="[
            { label: `All ${field.label.toLowerCase()}`, value: allFilterValue },
            ...(field.options ?? [])
          ]"
          :aria-label="`Filter by ${field.label}`"
        />

        <USelect
          v-model="selectedPageSize"
          :items="pageSizeItems"
        />
      </div>

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
          {{ emptyLabel }}
        </div>

        <article
          v-for="record in visibleRecords"
          v-else
          :key="record.id"
          class="group"
        >
          <button
            type="button"
            class="grid w-full cursor-pointer list-none grid-cols-[1fr_auto] gap-3 p-4 text-left transition hover:bg-muted/40"
            @click="expandedRecordId = expandedRecordId === record.id ? null : record.id"
          >
            <div class="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_repeat(3,minmax(7rem,10rem))] sm:items-center">
              <div class="min-w-0">
                <p class="truncate font-medium">
                  {{ primaryField ? formatFieldValue(record[primaryField.key], primaryField) : record.id }}
                </p>
                <p class="mt-1 text-xs text-muted sm:hidden">
                  Tap to view details
                </p>
              </div>

              <div
                v-for="field in summaryFields.slice(1)"
                :key="field.key"
                class="hidden min-w-0 sm:block"
              >
                <p class="text-xs text-muted">
                  {{ field.label }}
                </p>
                <p class="truncate text-sm text-highlighted">
                  {{ formatFieldValue(record[field.key], field) }}
                </p>
              </div>
            </div>

            <UIcon
              name="i-lucide-chevron-down"
              class="size-4 text-muted transition-transform"
              :class="{ 'rotate-180': expandedRecordId === record.id }"
            />
          </button>

          <div
            v-if="expandedRecordId === record.id"
            class="flex flex-col gap-4 border-t border-default px-4 py-4"
          >
            <dl
              v-if="detailFields.length"
              class="grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4"
            >
              <div
                v-for="field in detailFields"
                :key="field.key"
                class="min-w-0"
              >
                <dt class="text-sm text-muted">
                  {{ field.label }}
                </dt>
                <dd class="mt-1 whitespace-pre-wrap text-highlighted">
                  {{ formatFieldValue(record[field.key], field) }}
                </dd>
              </div>
            </dl>

            <div class="flex flex-wrap justify-end gap-2 border-t border-default pt-4">
              <UButton
                label="Edit"
                icon="i-lucide-pencil"
                color="neutral"
                variant="outline"
                size="sm"
                class="w-fit"
                @click="openEditModal(record)"
              />
            </div>
          </div>
        </article>
      </div>

      <div
        v-if="resultCount"
        class="flex flex-col gap-3 border-t border-default p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="text-sm text-muted">
          Showing {{ resultStart }}-{{ resultEnd }} of {{ resultCount }} rows
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
