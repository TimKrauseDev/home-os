<script setup lang="ts">
import type { DomainScaffoldSection, DomainScaffoldStatCard } from '~/types/domain-scaffold'

defineProps<{
  title: string
  description: string
  icon: string
  stats?: DomainScaffoldStatCard[]
  sections?: DomainScaffoldSection[]
}>()
</script>

<template>
  <div class="flex flex-col gap-4 sm:gap-6">
    <UPageCard
      :title="title"
      :description="description"
      :icon="icon"
      variant="subtle"
    />

    <div
      v-if="stats?.length"
      class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      <UPageCard
        v-for="stat in stats"
        :key="stat.label"
        :title="stat.label"
        :description="stat.value"
        :icon="stat.icon"
      />
    </div>

    <div
      v-if="sections?.length"
      class="grid gap-4 lg:grid-cols-2"
    >
      <UPageCard
        v-for="section in sections"
        :key="section.title"
        :title="section.title"
        :description="section.description"
        :icon="section.icon"
        variant="subtle"
      >
        <ul class="grid gap-2 text-sm">
          <li
            v-for="item in section.items"
            :key="item"
            class="flex gap-2"
          >
            <UIcon name="i-lucide-dot" class="mt-0.5 size-4 shrink-0 text-muted" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </UPageCard>
    </div>
  </div>
</template>
