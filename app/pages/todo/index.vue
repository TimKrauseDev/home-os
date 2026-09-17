<script setup lang="ts">
const data = [{
  id: 1,
  title: 'Sample Todo',
  completed: false
}, {
  id: 2,
  title: 'Another Todo',
  completed: true
}, {
  id: 3,
  title: 'Yet Another Todo',
  completed: false
}]
</script>

<template>
  <UDashboardPanel id="todo">
    <template #header>
      <UDashboardNavbar title="Todo">
        <template #leading>
          <UIcon name="i-lucide-list-todo" class="size-5" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div>body</div>
    </template>

    <template #footer>
      <div>footer</div>
    </template>
  </UDashboardPanel>
</template>
