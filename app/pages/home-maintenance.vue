<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const links = [[{
  label: 'Overview',
  icon: 'i-lucide-layout-dashboard',
  to: '/home-maintenance',
  exact: true
}, {
  label: 'Tasks',
  icon: 'i-lucide-list-checks',
  to: '/home-maintenance/tasks'
}, {
  label: 'History',
  icon: 'i-lucide-history',
  to: '/home-maintenance/history'
}]] satisfies NavigationMenuItem[][]
</script>

<template>
  <UDashboardPanel id="home-maintenance" :ui="{ body: 'lg:py-8' }">
    <template #header>
      <UDashboardNavbar title="Home Maintenance">
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
