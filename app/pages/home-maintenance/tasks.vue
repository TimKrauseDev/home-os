<script setup lang="ts">
const stats = [
  { label: 'Active', value: '24 tasks', icon: 'i-lucide-list-checks' },
  { label: 'Interior', value: '13 tasks', icon: 'i-lucide-sofa' },
  { label: 'Exterior', value: '11 tasks', icon: 'i-lucide-trees' },
  { label: 'Paused', value: '3 tasks', icon: 'i-lucide-pause' }
]
const sections = [
  {
    title: 'Task List',
    description: 'V1 list layout before database wiring.',
    icon: 'i-lucide-list-todo',
    items: ['HVAC filter · monthly · interior · high', 'Windows · spring and fall · exterior · medium', 'Dryer vent · yearly · interior · high', 'Gutters · spring and fall · exterior · high']
  },
  {
    title: 'Expected Controls',
    description: 'Controls to wire once the maintenance schema exists.',
    icon: 'i-lucide-sliders-horizontal',
    items: ['Add recurring task', 'Assign multiple cadences', 'Mark in progress or complete', 'Archive tasks that no longer matter']
  }
]
</script>

<template>
  <DomainScaffold
    title="Maintenance Tasks"
    description="Recurring care tasks with area, cadence, next due date, status, priority, and notes."
    icon="i-lucide-list-checks"
    :actions="[{ label: 'History', icon: 'i-lucide-history', to: '/home-maintenance/history' }]"
    :stats="stats"
    :sections="sections"
  />
</template>
