<script setup lang="ts">
const fields = [
  { key: 'domain', label: 'Domain', required: true },
  { key: 'channel', label: 'Channel', type: 'select', options: [{ label: 'Email', value: 'email' }, { label: 'ntfy', value: 'ntfy' }, { label: 'SMS', value: 'sms' }] },
  { key: 'timing', label: 'Timing' },
  { key: 'enabled', label: 'Enabled', type: 'checkbox' },
  { key: 'notes', label: 'Notes', type: 'textarea', table: false }
] as const
</script>

<template>
  <DomainTablePage
    title="Notifications"
    description="Email reminder preferences first, with ntfy push notifications planned after v1."
    icon="i-lucide-bell"
    add-label="Add Reminder Rule"
    empty-label="No notification rules yet."
    :fields="fields"
    table-name="notification_rules"
    :order-by="{ column: 'domain', ascending: true }"
    :stats="[
      { label: 'V1 Channel', value: 'Email', icon: 'i-lucide-mail' },
      { label: 'Push', value: 'ntfy later', icon: 'i-lucide-bell' },
      { label: 'SMS', value: 'Optional', icon: 'i-lucide-message-square' },
      { label: 'Schedule', value: 'Daily scan', icon: 'i-lucide-calendar-clock' }
    ]"
  />
</template>
