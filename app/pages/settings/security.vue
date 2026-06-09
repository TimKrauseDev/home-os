<script setup lang="ts">
const fields = [
  { key: 'control', label: 'Control', required: true },
  { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Planned', value: 'planned' }, { label: 'In Progress', value: 'in_progress' }, { label: 'Active', value: 'active' }, { label: 'Deferred', value: 'deferred' }] },
  { key: 'area', label: 'Area', type: 'select', options: [{ label: 'Hosting', value: 'hosting' }, { label: 'Auth', value: 'auth' }, { label: 'Data', value: 'data' }, { label: 'Exports', value: 'exports' }] },
  { key: 'notes', label: 'Notes', type: 'textarea', table: false }
] as const
</script>

<template>
  <DomainTablePage
    title="Security"
    description="Authentication, household access, local network hosting, and private data controls."
    icon="i-lucide-shield"
    add-label="Add Control"
    empty-label="No security controls yet."
    :fields="fields"
    table-name="security_controls"
    :order-by="{ column: 'area', ascending: true }"
    :stats="[
      { label: 'Audience', value: 'Household only', icon: 'i-lucide-home' },
      { label: 'Access', value: 'Private LAN', icon: 'i-lucide-wifi' },
      { label: 'Auth', value: 'Future', icon: 'i-lucide-key-round' },
      { label: 'Data', value: 'Supabase', icon: 'i-lucide-database' }
    ]"
  />
</template>
