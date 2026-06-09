<script setup lang="ts">
const fields = [
  { key: 'item', label: 'Needs Attention', required: true },
  { key: 'domain', label: 'Domain', type: 'select', options: [{ label: 'Gardening', value: 'gardening' }, { label: 'Maintenance', value: 'maintenance' }, { label: 'Improvements', value: 'improvements' }, { label: 'Budgeting', value: 'budgeting' }] },
  { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Due Soon', value: 'due_soon' }, { label: 'Blocked', value: 'blocked' }, { label: 'Needs Review', value: 'needs_review' }, { label: 'Upcoming', value: 'upcoming' }] },
  { key: 'due_date', label: 'Due', type: 'date' },
  { key: 'notes', label: 'Notes', type: 'textarea', table: false }
] as const
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Home">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-6xl">
        <DomainTablePage
          title="Household Dashboard"
          description="A practical overview of what needs attention across gardening, maintenance, improvements, and budgeting."
          icon="i-lucide-house"
          add-label="Add Attention Item"
          empty-label="Nothing needs attention right now."
          :fields="fields"
          table-name="dashboard_attention_items"
          :order-by="{ column: 'due_date', ascending: true }"
          :stats="[
            { label: 'Gardening', value: 'Active', icon: 'i-lucide-sprout' },
            { label: 'Maintenance', value: '3 rows', icon: 'i-lucide-wrench' },
            { label: 'Projects', value: '3 rows', icon: 'i-lucide-hammer' },
            { label: 'Budgeting', value: '3 rows', icon: 'i-lucide-wallet' }
          ]"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>
