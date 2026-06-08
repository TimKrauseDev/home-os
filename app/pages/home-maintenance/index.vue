<script setup lang="ts">
const actions = [
  { label: 'Tasks', icon: 'i-lucide-list-checks', to: '/home-maintenance/tasks' },
  { label: 'History', icon: 'i-lucide-history', to: '/home-maintenance/history' }
]
const stats = [
  { label: 'Due Soon', value: '6 tasks', icon: 'i-lucide-calendar-clock' },
  { label: 'Overdue', value: '2 tasks', icon: 'i-lucide-triangle-alert' },
  { label: 'In Progress', value: '1 task', icon: 'i-lucide-loader-circle' },
  { label: 'Completed', value: '18 this year', icon: 'i-lucide-check' }
]
const sections = [
  {
    title: 'Needs Attention',
    description: 'The work queue for recurring household care.',
    icon: 'i-lucide-bell',
    items: ['Replace HVAC filter', 'Clean dryer vent', 'Inspect exterior caulk', 'Flush water heater']
  },
  {
    title: 'Cadence Mix',
    description: 'Maintenance can repeat by month, season, year, or custom intervals.',
    icon: 'i-lucide-repeat',
    items: ['Monthly checks for filters and drains', 'Spring and fall exterior tasks', 'Yearly safety and appliance reviews', 'Custom reminders for oddball chores']
  }
]
</script>

<template>
  <DomainScaffold
    title="Home Maintenance"
    description="Recurring household care by monthly, seasonal, yearly, and custom cadence."
    icon="i-lucide-wrench"
    :actions="actions"
    :stats="stats"
    :sections="sections"
  />
</template>
