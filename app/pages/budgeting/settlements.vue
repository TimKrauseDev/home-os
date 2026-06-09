<script setup lang="ts">
const fields = [
  { key: 'title', label: 'Task', required: true },
  { key: 'payer', label: 'Payer', required: true },
  { key: 'recipient', label: 'Recipient', required: true },
  { key: 'source_type', label: 'Source', type: 'select', table: false, options: [{ label: 'Bill Split', value: 'bill_split' }, { label: 'Balance Difference', value: 'balance_difference' }, { label: 'Purchase Share', value: 'purchase_share' }, { label: 'Manual', value: 'manual' }, { label: 'Other', value: 'other' }] },
  { key: 'amount_due', label: 'Amount Due', type: 'number' },
  { key: 'due_date', label: 'Due', type: 'date' },
  { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Pending', value: 'pending' }, { label: 'Completed', value: 'completed' }, { label: 'Canceled', value: 'canceled' }, { label: 'Skipped', value: 'skipped' }] },
  { key: 'notes', label: 'Notes', type: 'textarea', table: false }
] as const
</script>

<template>
  <DomainTablePage
    title="Settle Up"
    description="Household payback tasks from shared transactions, net differences, and large purchases."
    icon="i-lucide-hand-coins"
    add-label="Add Settlement"
    empty-label="No settlement tasks yet."
    :fields="fields"
    table-name="budget_settlement_tasks"
    :order-by="{ column: 'due_date', ascending: true }"
    :stats="[
      { label: 'Pending', value: '$810', icon: 'i-lucide-hand-coins' },
      { label: 'Requests', value: '2 open', icon: 'i-lucide-send' },
      { label: 'Completed', value: '0', icon: 'i-lucide-check' },
      { label: 'Linked Rows', value: '0', icon: 'i-lucide-link' }
    ]"
  />
</template>
