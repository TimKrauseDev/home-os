<script setup lang="ts">
const fields = [
  { key: 'name', label: 'Bucket', required: true },
  { key: 'owner', label: 'Owner', type: 'select', options: [{ label: 'Self', value: 'self' }, { label: 'Spouse', value: 'spouse' }, { label: 'Joint', value: 'joint' }, { label: 'Household', value: 'household' }] },
  { key: 'target_amount', label: 'Target', type: 'number' },
  { key: 'current_amount', label: 'Current', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Active', value: 'active' }, { label: 'Paused', value: 'paused' }, { label: 'Completed', value: 'completed' }, { label: 'Archived', value: 'archived' }] },
  { key: 'notes', label: 'Notes', type: 'textarea', table: false }
] as const
</script>

<template>
  <DomainTablePage
    title="Savings Buckets"
    description="Track fun money, larger purchases, and planned household allocations."
    icon="i-lucide-piggy-bank"
    add-label="Add Bucket"
    empty-label="No savings buckets yet."
    :fields="fields"
    table-name="budget_savings_buckets"
    :order-by="{ column: 'name', ascending: true }"
    :stats="[
      { label: 'Buckets', value: '3 active', icon: 'i-lucide-piggy-bank' },
      { label: 'Allocated', value: '$3,900', icon: 'i-lucide-coins' },
      { label: 'Targets', value: '$6,800', icon: 'i-lucide-target' },
      { label: 'Completed', value: '0', icon: 'i-lucide-check' }
    ]"
  />
</template>
