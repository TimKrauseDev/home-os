<script setup lang="ts">
const stats = [
  { label: 'Members', value: '2 active', icon: 'i-lucide-users' },
  { label: 'Email', value: '2 recipients', icon: 'i-lucide-mail' },
  { label: 'Budget Owners', value: 'Self, spouse', icon: 'i-lucide-wallet' },
  { label: 'Push', value: 'ntfy later', icon: 'i-lucide-bell' }
]
const sections = [
  {
    title: 'Household Members',
    description: 'People who can receive reminders and own budget accounts.',
    icon: 'i-lucide-users',
    items: ['Self · app owner · budget owner', 'Spouse · household member · budget owner', 'Notification recipients can differ by domain', 'Future permissions can stay simple']
  },
  {
    title: 'Member Preferences',
    description: 'Settings to wire after auth and notifications exist.',
    icon: 'i-lucide-user-cog',
    items: ['Email address', 'Reminder channels', 'Budget settlement display name', 'Domain-specific notification toggles']
  }
]
</script>

<template>
  <DomainScaffold
    title="Household Members"
    description="Household member preferences, budget ownership, and notification recipients."
    icon="i-lucide-users"
    :stats="stats"
    :sections="sections"
  />
</template>
