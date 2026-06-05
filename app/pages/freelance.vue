<template>
  <UDashboardPanel id="freelance" :ui="{ body: 'lg:py-8' }">
    <template #header>
      <UDashboardNavbar title="Freelance">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-6xl">
        <NuxtPage />
      </div>
    </template>
  </UDashboardPanel>
</template>
