<script setup lang="ts">
const fields = [
  { key: 'transaction_date', label: 'Date', type: 'date', required: true },
  { key: 'account_id', label: 'Account', type: 'select', required: true, optionSource: { tableName: 'budget_accounts', labelColumn: 'name' } },
  { key: 'merchant_id', label: 'Merchant Default', type: 'select', table: false, optionSource: { tableName: 'budget_merchants', labelColumn: 'name' } },
  { key: 'merchant', label: 'Merchant Text', table: false },
  { key: 'description', label: 'Description', required: true },
  { key: 'category_id', label: 'Category', type: 'select', optionSource: { tableName: 'budget_categories', labelColumn: 'name' } },
  { key: 'amount', label: 'Amount', type: 'number', required: true },
  { key: 'transaction_type', label: 'Type', type: 'select', options: [{ label: 'Income', value: 'income' }, { label: 'Expense', value: 'expense' }, { label: 'Transfer', value: 'transfer' }, { label: 'Adjustment', value: 'adjustment' }] },
  { key: 'status', label: 'Status', type: 'select', table: false, options: [{ label: 'Pending', value: 'pending' }, { label: 'Cleared', value: 'cleared' }, { label: 'Reviewed', value: 'reviewed' }, { label: 'Ignored', value: 'ignored' }] },
  { key: 'notes', label: 'Notes', type: 'textarea', table: false }
] as const
</script>

<template>
  <DomainTablePage
    title="Transactions"
    description="Imported and manually entered transactions for review, categorization, and merchant defaults."
    icon="i-lucide-receipt-text"
    add-label="Add Transaction"
    empty-label="No transactions yet."
    :fields="fields"
    table-name="budget_transactions"
    :order-by="{ column: 'transaction_date', ascending: false }"
    :stats="[
      { label: 'Rows', value: '3', icon: 'i-lucide-receipt-text' },
      { label: 'Money In', value: '$3,625', icon: 'i-lucide-arrow-down-left' },
      { label: 'Money Out', value: '$2,142', icon: 'i-lucide-arrow-up-right' },
      { label: 'Unreviewed', value: '1', icon: 'i-lucide-circle-help' }
    ]"
  />
</template>
