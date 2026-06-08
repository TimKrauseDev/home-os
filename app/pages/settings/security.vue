<script setup lang="ts">
const stats = [
  { label: 'Audience', value: 'Household only', icon: 'i-lucide-home' },
  { label: 'Access', value: 'Private LAN', icon: 'i-lucide-wifi' },
  { label: 'Auth', value: 'Future', icon: 'i-lucide-key-round' },
  { label: 'Data', value: 'Supabase', icon: 'i-lucide-database' }
]
const sections = [
  {
    title: 'Access Rules',
    description: 'Home OS is not a public SaaS app.',
    icon: 'i-lucide-shield',
    items: ['Keep local during development', 'Do not expose publicly without auth', 'Later Raspberry Pi hosting stays on household network', 'Use hosted Supabase for managed backups']
  },
  {
    title: 'Security Backlog',
    description: 'Controls to add when the app leaves early development.',
    icon: 'i-lucide-lock-keyhole',
    items: ['Household authentication', 'Environment variable audit', 'Export and backup controls', 'Document data boundary rules before integrations']
  }
]
</script>

<template>
  <DomainScaffold
    title="Security"
    description="Authentication, household access, local network hosting, and private data controls."
    icon="i-lucide-shield"
    :stats="stats"
    :sections="sections"
  />
</template>
