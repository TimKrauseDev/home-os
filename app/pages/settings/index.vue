<script setup lang="ts">
const fields = [
  { key: 'setting', label: 'Setting', required: true },
  { key: 'value', label: 'Value' },
  { key: 'area', label: 'Area', type: 'select', options: [{ label: 'Household', value: 'household' }, { label: 'Hosting', value: 'hosting' }, { label: 'Database', value: 'database' }, { label: 'Exports', value: 'exports' }, { label: 'Gardening', value: 'gardening' }] },
  { key: 'notes', label: 'Notes', type: 'textarea' }
] as const
</script>

<template>
  <DomainTablePage
    title="General Settings"
    description="Household-wide app preferences, exports, hosting notes, and data ownership defaults."
    icon="i-lucide-settings"
    add-label="Add Setting"
    empty-label="No settings yet."
    :actions="[{ label: 'Members', icon: 'i-lucide-users', to: '/settings/members' }, { label: 'Notifications', icon: 'i-lucide-bell', to: '/settings/notifications' }, { label: 'Security', icon: 'i-lucide-shield', to: '/settings/security' }]"
    :fields="fields"
    table-name="app_settings"
    :order-by="{ column: 'setting', ascending: true }"
    :stats="[
      { label: 'Hosting', value: 'Local dev', icon: 'i-lucide-server' },
      { label: 'Database', value: 'Supabase', icon: 'i-lucide-database' },
      { label: 'Exports', value: 'CSV planned', icon: 'i-lucide-download' },
      { label: 'Household', value: 'Private', icon: 'i-lucide-lock' }
    ]"
  />
</template>
