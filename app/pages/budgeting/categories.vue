<script setup lang="ts">
const fields = [
  { key: 'name', label: 'Category', required: true },
  { key: 'group_name', label: 'Group' },
  { key: 'category_type', label: 'Type', type: 'select', options: [{ label: 'Income', value: 'income' }, { label: 'Expense', value: 'expense' }, { label: 'Transfer', value: 'transfer' }, { label: 'Savings', value: 'savings' }] },
  { key: 'monthly_goal_amount', label: 'Monthly Goal', type: 'number' },
  { key: 'goal_behavior', label: 'Goal Behavior', type: 'select', options: [{ label: 'Keep Under', value: 'keep_under' }, { label: 'Spend Exactly', value: 'spend_exactly' }, { label: 'Save At Least', value: 'save_at_least' }, { label: 'Track Only', value: 'track_only' }] },
  { key: 'is_active', label: 'Active', type: 'checkbox' },
  { key: 'notes', label: 'Notes', type: 'textarea', table: false }
] as const
</script>

<template>
  <DomainTablePage
    title="Categories"
    description="Budget categories, monthly goals, groupings, and merchant defaults."
    icon="i-lucide-tags"
    add-label="Add Category"
    empty-label="No budget categories yet."
    :actions="[{ label: 'Transactions', icon: 'i-lucide-receipt-text', to: '/budgeting/transactions' }]"
    :fields="fields"
    table-name="budget_categories"
    :order-by="{ column: 'sort_order', ascending: true }"
    :stats="[
      { label: 'Categories', value: '3 active', icon: 'i-lucide-tags' },
      { label: 'Expense', value: '2', icon: 'i-lucide-arrow-up-right' },
      { label: 'Savings', value: '1', icon: 'i-lucide-piggy-bank' },
      { label: 'Track Only', value: '0', icon: 'i-lucide-eye' }
    ]"
  />
</template>
