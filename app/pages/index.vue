<script setup lang="ts">
const stats = [
  { label: 'Gardening', value: 'Active build', icon: 'i-lucide-sprout' },
  { label: 'Maintenance', value: 'Scaffolded', icon: 'i-lucide-wrench' },
  { label: 'Projects', value: 'Scaffolded', icon: 'i-lucide-hammer' },
  { label: 'Budgeting', value: 'Scaffolded', icon: 'i-lucide-wallet' }
]
const sections = [
  {
    title: 'Needs Attention',
    description: 'The household work queue once all domains are wired to Supabase.',
    icon: 'i-lucide-bell',
    items: ['Planting tasks due soon', 'Overdue maintenance tasks', 'Blocked improvement projects', 'Budget settlements waiting on payment']
  },
  {
    title: 'Domain Shortcuts',
    description: 'Jump into the places most likely to need action.',
    icon: 'i-lucide-route',
    items: ['Gardening overview and seed catalog', 'Maintenance task queue', 'Improvement project board', 'Budget transaction review and settle up']
  }
]
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Home">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:gap-6">
        <DomainScaffold
          title="Household Dashboard"
          description="A practical overview of what needs attention across gardening, maintenance, improvements, and budgeting."
          icon="i-lucide-house"
          :actions="[{ label: 'Gardening', icon: 'i-lucide-sprout', to: '/gardening' }, { label: 'Maintenance', icon: 'i-lucide-wrench', to: '/home-maintenance' }, { label: 'Improvements', icon: 'i-lucide-hammer', to: '/home-improvement' }, { label: 'Budgeting', icon: 'i-lucide-wallet', to: '/budgeting' }]"
          :stats="stats"
          :sections="sections"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>
