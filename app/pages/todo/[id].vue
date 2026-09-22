<script setup lang="ts">
import type { NewTodo } from '~/types/todo'
import { TODO_CATEGORIES } from '#shared/constants'

const {
  fetchTodo,
  updateTodo,
  deleteTodo
} = useTodoApi()
const route = useRoute()
const todoId = route.params.id

const { data, refresh } = await fetchTodo(String(todoId))

if (!data.value) navigateTo('/todo')

const formData = reactive<NewTodo>({
  title: data.value?.title ?? '',
  description: data.value?.description ?? '',
  content: data.value?.content ?? {
    type: 'doc',
    content: [{ type: 'paragraph' }]
  },
  completed: data.value?.completed ?? false,
  category: data.value?.category ?? 'General',
  due_date: data.value?.due_date ?? null
})

const dueDateInput = computed({
  get: () => formData.due_date?.slice(0, 10) ?? '',
  set: (value) => {
    formData.due_date = value || null
  }
})

const todoCategories = ref(TODO_CATEGORIES)

const handleSave = async () => {
  await updateTodo(todoId as string, formData)
  await refresh()
}
</script>

<template>
  <UDashboardPanel :id="`todo-${todoId}`">
    <!-- Panel Header -->
    <template #header>
      <UDashboardNavbar title="Todo Details">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <!-- Panel Body -->
    <template #body>
      <h1>Todo Details Page</h1>

      <UCard>
        <template #header>
          Todo Details
        </template>

        <UForm :state="formData" class="space-y-4">
          <UFormField label="Title">
            <UInput
              v-model="formData.title"
              label="Title"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Description">
            <UTextarea
              v-model="formData.description"
              class="w-full"
              label="Description"
            />
          </UFormField>
          <UFormField label="Completed">
            <UCheckbox
              v-model="formData.completed"
              label="Completed"
            />
          </UFormField>
          <UFormField label="Category">
            <USelect
              v-model="formData.category"
              :items="todoCategories"
              label="Category"
            />
          </UFormField>
          <UFormField label="Due Date">
            <UInput
              v-model="dueDateInput"
              label="Due Date"
              type="date"
            />
          </UFormField>
          <UFormField label="Content">
            <TiptapEditor v-model="formData.content" />
          </UFormField>
        </UForm>

        <template #footer>
          <div v-if="data" class="flex space-x-4 justify-end">
            <UButton
              label="Save"
              @click="handleSave"
            />
            <UButton
              label="Delete"
              color="error"
              @click="deleteTodo(data.id)"
            />
          </div>
        </template>
      </UCard>
    </template>
  </UDashboardPanel>
</template>
