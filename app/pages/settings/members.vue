<script setup lang="ts">
const fields = [
  { key: 'name', label: 'Member', required: true },
  { key: 'role', label: 'Role', type: 'select', options: [{ label: 'Owner', value: 'owner' }, { label: 'Household Member', value: 'household_member' }] },
  { key: 'email', label: 'Email' },
  { key: 'budget_owner', label: 'Budget Owner Label' },
  { key: 'receives_email', label: 'Email Reminders', type: 'checkbox' },
  { key: 'notes', label: 'Notes', type: 'textarea', table: false }
] as const
</script>

<template>
  <DomainTablePage
    title="Household Members"
    description="Household member preferences, budget ownership, and notification recipients."
    icon="i-lucide-users"
    add-label="Add Member"
    empty-label="No household members yet."
    :fields="fields"
    table-name="household_members"
    :order-by="{ column: 'name', ascending: true }"
    :stats="[
      { label: 'Members', value: '2 active', icon: 'i-lucide-users' },
      { label: 'Email', value: '2 recipients', icon: 'i-lucide-mail' },
      { label: 'Budget Owners', value: 'Self, spouse', icon: 'i-lucide-wallet' },
      { label: 'Push', value: 'ntfy later', icon: 'i-lucide-bell' }
    ]"
  />
</template>
