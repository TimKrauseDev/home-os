<script setup lang="ts">
const fields = [
  { key: 'item', label: 'Budget Item', required: true },
  { key: 'domain', label: 'Domain', type: 'select', options: [{ label: 'Budgeting', value: 'budgeting' }] },
  { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Needs Review', value: 'needs_review' }, { label: 'Action Needed', value: 'action_needed' }, { label: 'Good', value: 'good' }, { label: 'Upcoming', value: 'upcoming' }] },
  { key: 'due_date', label: 'Due', type: 'date' },
  { key: 'notes', label: 'Notes', type: 'textarea', table: false }
] as const
</script>

<template>
  <DomainTablePage
    title="Budgeting"
    description="Household finances, transactions, category goals, savings buckets, and settlement tasks."
    icon="i-lucide-wallet"
    add-label="Add Budget Signal"
    empty-label="No budget signals yet."
    :fields="fields"
    :filters="[{ column: 'domain', value: 'budgeting' }]"
    table-name="dashboard_attention_items"
    :order-by="{ column: 'due_date', ascending: true }"
    :stats="[
      { label: 'Balances', value: '$11,830', icon: 'i-lucide-chart-no-axes-combined' },
      { label: 'Money In', value: '$3,625', icon: 'i-lucide-arrow-down-left' },
      { label: 'Money Out', value: '$2,142', icon: 'i-lucide-arrow-up-right' },
      { label: 'To Settle', value: '$750', icon: 'i-lucide-hand-coins' }
    ]"
  />
</template>
