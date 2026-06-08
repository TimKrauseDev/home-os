<script setup lang="ts">
const stats = [
  { label: 'V1 Channel', value: 'Email', icon: 'i-lucide-mail' },
  { label: 'Push', value: 'ntfy later', icon: 'i-lucide-bell' },
  { label: 'SMS', value: 'Optional', icon: 'i-lucide-message-square' },
  { label: 'Schedule', value: 'Daily scan', icon: 'i-lucide-calendar-clock' }
]
const sections = [
  {
    title: 'Reminder Sources',
    description: 'Where notifications will come from.',
    icon: 'i-lucide-bell',
    items: ['Gardening planting windows and tasks', 'Maintenance due and overdue tasks', 'Improvement todos with due dates', 'Budget settlement tasks']
  },
  {
    title: 'Notification Plan',
    description: 'Cheap first, more interesting later.',
    icon: 'i-lucide-route',
    items: ['Start with email reminders', 'Add ntfy after v1 when phone alerts matter', 'Treat SMS as optional due to cost', 'Make preferences configurable per member and domain']
  }
]
</script>

<template>
  <DomainScaffold
    title="Notifications"
    description="Email reminder preferences first, with ntfy push notifications planned after v1."
    icon="i-lucide-bell"
    :stats="stats"
    :sections="sections"
  />
</template>
