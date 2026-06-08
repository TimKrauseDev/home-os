<script setup lang="ts">
const stats = [
  { label: 'Hosting', value: 'Local dev', icon: 'i-lucide-server' },
  { label: 'Database', value: 'Supabase', icon: 'i-lucide-database' },
  { label: 'Exports', value: 'CSV planned', icon: 'i-lucide-download' },
  { label: 'Household', value: 'Private', icon: 'i-lucide-lock' }
]
const sections = [
  {
    title: 'General Preferences',
    description: 'App-level settings that affect every domain.',
    icon: 'i-lucide-settings',
    items: ['Household name and timezone', 'Ebony, VA garden location', 'CSV export preferences', 'Local hosting notes']
  },
  {
    title: 'V1 Operations',
    description: 'Keep the app practical and recoverable.',
    icon: 'i-lucide-wrench',
    items: ['Hosted Supabase remains the database', 'Run locally during development', 'Move app server to Raspberry Pi later', 'Per-domain CSV export first']
  }
]
</script>

<template>
  <DomainScaffold
    title="General Settings"
    description="Household-wide app preferences, exports, hosting notes, and data ownership defaults."
    icon="i-lucide-settings"
    :actions="[{ label: 'Members', icon: 'i-lucide-users', to: '/settings/members' }, { label: 'Notifications', icon: 'i-lucide-bell', to: '/settings/notifications' }, { label: 'Security', icon: 'i-lucide-shield', to: '/settings/security' }]"
    :stats="stats"
    :sections="sections"
  />
</template>
