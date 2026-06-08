<script setup lang="ts">
import type { DomainPageAction, DomainStatCard, DomainTableField, DomainTableFilter, DomainTableOrder, DomainTableRecord } from '~/types/domain-table'

const props = defineProps<{
  title: string
  description: string
  icon: string
  addLabel: string
  emptyLabel: string
  fields: readonly DomainTableField[]
  filters?: readonly DomainTableFilter[]
  initialRecords?: readonly DomainTableRecord[]
  actions?: DomainPageAction[]
  orderBy?: DomainTableOrder
  stats?: DomainStatCard[]
  tableName?: string
}>()

const {
  closeModal,
  fields: hydratedFields,
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
            v-for="action in actions"
            :key="action.label"
            :label="action.label"
            :icon="action.icon"
            :to="action.to"
            color="neutral"
            variant="outline"
            class="w-fit"
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

    <section class="overflow-hidden rounded-lg border border-default bg-default shadow-xs">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-default text-sm">
          <thead class="bg-muted/40 text-left text-xs uppercase text-muted">
            <tr>
              <th
                v-for="field in tableFields"
                :key="field.key"
                class="px-4 py-3 font-medium"
              >
                {{ field.label }}
              </th>
              <th class="px-4 py-3 text-right font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-default">
            <tr v-if="!records.length">
              <td :colspan="tableFields.length + 1" class="px-4 py-6 text-muted">
                {{ isLoading ? 'Loading...' : emptyLabel }}
              </td>
            </tr>
            <tr
              v-for="record in records"
              v-else
              :key="record.id"
              class="align-top"
            >
              <td
                v-for="field in tableFields"
                :key="field.key"
                class="px-4 py-3"
              >
                {{ formatFieldValue(record[field.key], field) }}
              </td>
              <td class="px-4 py-3 text-right">
                <UButton
                  label="Edit"
                  icon="i-lucide-pencil"
                  color="neutral"
                  variant="outline"
                  size="sm"
                  class="w-fit"
                  @click="openEditModal(record)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
