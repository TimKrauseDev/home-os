<script setup lang="ts">
const stats = [
  { label: 'This Month', value: '5 done', icon: 'i-lucide-calendar-check' },
  { label: 'This Year', value: '18 done', icon: 'i-lucide-check' },
  { label: 'Follow-ups', value: '3 notes', icon: 'i-lucide-message-square' },
  { label: 'Skipped', value: '2 tasks', icon: 'i-lucide-forward' }
]
const sections = [
  {
    title: 'Recent Completions',
    description: 'Long-term household memory for maintenance work.',
    icon: 'i-lucide-history',
    items: ['Cleaned dryer vent · noted light lint buildup', 'Changed HVAC filter · 20x25x1', 'Checked smoke detectors · all passed', 'Cleaned gutters · back side needs guard repair']
  },
  {
    title: 'Useful History Details',
    description: 'Keep this lightweight so completion is easy.',
    icon: 'i-lucide-notebook',
    items: ['Completed date', 'Who completed it', 'One notes field', 'Link back to recurring task']
  }
]
</script>

<template>
  <DomainScaffold
    title="Maintenance History"
    description="Completed maintenance records, simple notes, and follow-up context."
    icon="i-lucide-history"
    :actions="[{ label: 'Tasks', icon: 'i-lucide-list-checks', to: '/home-maintenance/tasks' }]"
    :stats="stats"
    :sections="sections"
  />
</template>
