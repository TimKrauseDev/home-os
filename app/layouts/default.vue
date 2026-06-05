<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import HeaderLogo from '~/components/HeaderLogo.vue'

const open = ref(false)
const closeSidebar = () => {
  open.value = false
}

const links = [[{
  label: 'Home',
  icon: 'i-lucide-house',
  to: '/',
  onSelect: closeSidebar
}, {
  label: 'Gardening',
  to: '/gardening',
  icon: 'i-lucide-sprout',
  defaultOpen: true,
  type: 'trigger',
  children: [{
    label: 'Overview',
    to: '/gardening',
    exact: true,
    onSelect: closeSidebar
  }, {
    label: 'Seed Catalog',
    to: '/gardening/seed-catalog',
    onSelect: closeSidebar
  }, {
    label: 'Planting Tasks',
    to: '/gardening/tasks',
    onSelect: closeSidebar
  }]
}, {
  label: 'Maintenance',
  to: '/home-maintenance',
  icon: 'i-lucide-wrench',
  defaultOpen: false,
  type: 'trigger',
  children: [{
    label: 'Overview',
    to: '/home-maintenance',
    exact: true,
    onSelect: closeSidebar
  }, {
    label: 'Tasks',
    to: '/home-maintenance/tasks',
    onSelect: closeSidebar
  }, {
    label: 'History',
    to: '/home-maintenance/history',
    onSelect: closeSidebar
  }]
}, {
  label: 'Improvements',
  to: '/home-improvement',
  icon: 'i-lucide-hammer',
  defaultOpen: false,
  type: 'trigger',
  children: [{
    label: 'Overview',
    to: '/home-improvement',
    exact: true,
    onSelect: closeSidebar
  }, {
    label: 'Projects',
    to: '/home-improvement/projects',
    onSelect: closeSidebar
  }, {
    label: 'Todos',
    to: '/home-improvement/todos',
    onSelect: closeSidebar
  }]
}, {
  label: 'Budgeting',
  to: '/budgeting',
  icon: 'i-lucide-wallet',
  defaultOpen: false,
  type: 'trigger',
  children: [{
    label: 'Overview',
    to: '/budgeting',
    exact: true,
    onSelect: closeSidebar
  }, {
    label: 'Accounts',
    to: '/budgeting/accounts',
    onSelect: closeSidebar
  }, {
    label: 'Transactions',
    to: '/budgeting/transactions',
    onSelect: closeSidebar
  }, {
    label: 'Categories',
    to: '/budgeting/categories',
    onSelect: closeSidebar
  }, {
    label: 'Savings Buckets',
    to: '/budgeting/savings-buckets',
    onSelect: closeSidebar
  }, {
    label: 'Settle Up',
    to: '/budgeting/settlements',
    onSelect: closeSidebar
  }, {
    label: 'Imports',
    to: '/budgeting/imports',
    onSelect: closeSidebar
  }]
}, {
  label: 'Freelance',
  to: '/freelance',
  icon: 'i-lucide-briefcase',
  defaultOpen: false,
  type: 'trigger',
  children: [{
    label: 'Overview',
    to: '/freelance',
    exact: true,
    onSelect: closeSidebar
  }]
}, {
  label: 'Settings',
  to: '/settings',
  icon: 'i-lucide-settings',
  defaultOpen: true,
  type: 'trigger',
  children: [{
    label: 'General',
    to: '/settings',
    exact: true,
    onSelect: closeSidebar
  }, {
    label: 'Members',
    to: '/settings/members',
    onSelect: closeSidebar
  }, {
    label: 'Notifications',
    to: '/settings/notifications',
    onSelect: closeSidebar
  }, {
    label: 'Security',
    to: '/settings/security',
    onSelect: closeSidebar
  }]
}]] satisfies NavigationMenuItem[][]

const groups = computed(() => [{
  id: 'links',
  label: 'Go to',
  items: links.flat()
}])
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header>
        <HeaderLogo />
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <slot />
  </UDashboardGroup>
</template>
