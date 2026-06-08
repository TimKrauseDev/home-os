<script setup lang="ts">
const fields = [
  { key: 'name', label: 'Account', required: true },
  { key: 'owner', label: 'Owner', type: 'select', options: [{ label: 'Self', value: 'self' }, { label: 'Spouse', value: 'spouse' }, { label: 'Joint', value: 'joint' }, { label: 'Household', value: 'household' }] },
  { key: 'account_type', label: 'Type', type: 'select', options: [{ label: 'Checking', value: 'checking' }, { label: 'Savings', value: 'savings' }, { label: 'Credit Card', value: 'credit_card' }, { label: 'Investment', value: 'investment' }, { label: 'Cash', value: 'cash' }, { label: 'Other', value: 'other' }] },
  { key: 'institution', label: 'Institution' },
  { key: 'current_balance', label: 'Balance', type: 'number' },
  { key: 'available_balance', label: 'Available', type: 'number' },
  { key: 'is_active', label: 'Active', type: 'checkbox' },
  { key: 'notes', label: 'Notes', type: 'textarea', table: false }
] as const
</script>

<template>
  <DomainTablePage
    title="Accounts"
    description="Household financial accounts, ownership, balances, and institutions."
    icon="i-lucide-landmark"
    add-label="Add Account"
    empty-label="No accounts yet."
    :actions="[{ label: 'Transactions', icon: 'i-lucide-receipt-text', to: '/budgeting/transactions' }]"
    :fields="fields"
    table-name="budget_accounts"
    :order-by="{ column: 'name', ascending: true }"
    :stats="[
      { label: 'Accounts', value: '3 active', icon: 'i-lucide-landmark' },
      { label: 'Self', value: '$4,250', icon: 'i-lucide-user' },
      { label: 'Spouse', value: '-$500', icon: 'i-lucide-user-round' },
      { label: 'Joint', value: '$8,080', icon: 'i-lucide-users' }
    ]"
  />
</template>
