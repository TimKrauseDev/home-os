<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const links = [[{
  label: 'Overview',
  icon: 'i-lucide-layout-dashboard',
  to: '/home-improvement',
  exact: true
}, {
  label: 'Projects',
  icon: 'i-lucide-folder-kanban',
  to: '/home-improvement/projects'
}, {
  label: 'Todos',
  icon: 'i-lucide-list-todo',
  to: '/home-improvement/todos'
}]] satisfies NavigationMenuItem[][]
</script>

<template>
  <UDashboardPanel id="home-improvement" :ui="{ body: 'lg:py-8' }">
    <template #header>
      <UDashboardNavbar title="Home Improvement">
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
