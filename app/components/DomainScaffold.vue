<script setup lang="ts">
type StatCard = {
  label: string
  value: string
  icon: string
}

type PageSection = {
  title: string
  description: string
  icon: string
  items: string[]
}

defineProps<{
  title: string
  description: string
  icon: string
  stats?: StatCard[]
  sections?: PageSection[]
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
