<script setup lang="ts">
const fields = [
  { key: 'file_name', label: 'File', required: true },
  { key: 'account_id', label: 'Account', type: 'select', required: true, optionSource: { tableName: 'budget_accounts', labelColumn: 'name' } },
  { key: 'institution', label: 'Institution' },
  { key: 'imported_at', label: 'Imported', type: 'date' },
  { key: 'row_count', label: 'Rows', type: 'number' },
  { key: 'created_count', label: 'Created', type: 'number', table: false },
  { key: 'skipped_count', label: 'Skipped', type: 'number', table: false },
  { key: 'notes', label: 'Notes', type: 'textarea', table: false }
] as const
</script>

<template>
  <DomainTablePage
    title="CSV Imports"
    description="Upload institution CSV files, review imported rows, and apply merchant defaults."
    icon="i-lucide-upload"
    add-label="Add Import Batch"
    empty-label="No import batches yet."
    :fields="fields"
    table-name="budget_transaction_imports"
    :order-by="{ column: 'imported_at', ascending: false }"
    :stats="[
      { label: 'Files', value: '2', icon: 'i-lucide-file-spreadsheet' },
      { label: 'Created', value: '110 rows', icon: 'i-lucide-plus' },
      { label: 'Skipped', value: '3 rows', icon: 'i-lucide-forward' },
      { label: 'Needs Review', value: '1 file', icon: 'i-lucide-circle-help' }
    ]"
  />
</template>
