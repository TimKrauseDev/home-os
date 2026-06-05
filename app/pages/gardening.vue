<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const links = [[{
  label: 'Overview',
  icon: 'i-lucide-layout-dashboard',
  to: '/gardening',
  exact: true
}, {
  label: 'Seed Catalog',
  icon: 'i-lucide-table-properties',
  to: '/gardening/seed-catalog'
}, {
  label: 'Planting Tasks',
  icon: 'i-lucide-list-todo',
  to: '/gardening/tasks'
}]] satisfies NavigationMenuItem[][]
</script>

<template>
  <UDashboardPanel id="gardening" :ui="{ body: 'lg:py-8' }">
    <template #header>
      <UDashboardNavbar title="Gardening">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UNavigationMenu :items="links" highlight class="-mx-1 flex-1" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-6xl">
        <NuxtPage />
      </div>
    </template>
  </UDashboardPanel>
</template>
