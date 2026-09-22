<script setup lang="ts">
import type { TodoItem, NewTodo } from '~/types/todo'
import { TODO_CATEGORIES } from '#shared/constants'

const {
  // fetchTodo,
  fetchTodos,
  addTodo,
  updateTodoCompletion,
  deleteTodo
} = useTodoApi()

const todoCategories = ref(TODO_CATEGORIES)
const isNewTodoModalOpen = ref(false)

const { data, refresh } = await fetchTodos()

async function handleToggleTodoCompletion(todo: TodoItem) {
  const completed = !todo.completed

  data.value = data.value.map(item =>
    item.id === todo.id ? { ...item, completed } : item
  )

  const success = await updateTodoCompletion(todo)

  if (success) {
    await refresh()
  } else {
    data.value = data.value.map(item =>
      item.id === todo.id ? { ...item, completed: todo.completed } : item
    )
  }
}

async function handleDeleteTodo(todo: TodoItem) {
  await deleteTodo(todo.id)
  await refresh()
}

const formData = reactive<NewTodo>({
  title: '',
  completed: false,
  category: 'General',
  due_date: null
})

const dueDateInput = computed({
  get: () => formData.due_date?.slice(0, 10) ?? '',
  set: (value) => {
    formData.due_date = value || null
  }
})

function resetFormData() {
  formData.title = ''
  formData.completed = false
  formData.category = 'General'
  formData.due_date = null
  isNewTodoModalOpen.value = false
}

const handleSave = async () => {
  const saveNewTodo = { ...formData }
  resetFormData()

  await addTodo(saveNewTodo)
  await refresh()
}
</script>

<template>
  <UDashboardPanel id="todo">
    <!-- Panel Header -->
    <template #header>
      <UDashboardNavbar title="Todo">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <!-- Panel Body -->
    <template #body>
      <UCard
        title="Manage Todo Items"
      >
        <TodoTable
          :data=" data "
          @toggle="handleToggleTodoCompletion"
          @delete="handleDeleteTodo"
        />
        <template #footer>
          <div class="flex justify-end">
            <UModal
              title="Add Todo Item"
              :open="isNewTodoModalOpen"
              :close="{
                color: 'primary',
                variant: 'outline',
                class: 'rounded-full'
              }"
            >
              <UButton
                label="Add Item"
                @click="isNewTodoModalOpen = true"
              />
              <template #body>
                <UForm :state="formData" class="space-y-4">
                  <UFormField label="Title">
                    <UInput
                      v-model="formData.title"
                      label="Title"
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
                </UForm>
              </template>
              <template #footer>
                <UButton
                  label="Save"
                  color="primary"
                  @click="handleSave"
                />
              </template>
            </UModal>
          </div>
        </template>
      </UCard>
    </template>
  </UDashboardPanel>
</template>
