<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { SortingState } from '@tanstack/vue-table'
import type { Row } from '@tanstack/table-core'
import type { TodoItem } from '~/types/todo'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()
const { copy } = useClipboard()

defineProps<{
  data: TodoItem[]
}>()

const emit = defineEmits<{
  toggle: [todo: TodoItem]
}>()

const sorting = ref<SortingState>([
  { id: 'completed', desc: false },
  { id: 'due_date', desc: false }
])

function getRowItems(row: Row<TodoItem>) {
  return [
    {
      type: 'label',
      label: 'Actions'
    },
    {
      label: 'Copy task ID',
      onSelect() {
        copy(row.original.id.toString())

        toast.add({
          title: 'Task ID copied to clipboard!',
          color: 'success',
          icon: 'i-lucide-check-circle'
        })
      }
    },
    {
      type: 'separator'
    },
    {
      label: row.original.completed
        ? 'Mark as pending'
        : 'Mark as completed',
      onSelect() {
        emit('toggle', row.original)
      }
    }
  ]
}

const columns: TableColumn<TodoItem>[] = [
  {
    id: 'expand',
    cell: ({ row }) =>
      h(UButton, {
        'color': 'neutral',
        'variant': 'ghost',
        'icon': 'i-lucide-chevron-down',
        'square': true,
        'aria-label': 'Expand row',
        'ui': {
          leadingIcon: [
            'transition-transform',
            row.getIsExpanded() ? 'duration-200 rotate-180' : ''
          ]
        },
        'onClick': () => row.toggleExpanded()
      })
  },
  {
    accessorKey: 'due_date',
    header: 'Date',
    sortingFn: (rowA, rowB) => {
      const dueDateA = rowA.getValue<string | null>('due_date')
      const dueDateB = rowB.getValue<string | null>('due_date')

      if (!dueDateA && !dueDateB) return 0
      if (!dueDateA) return 1
      if (!dueDateB) return -1

      const dateA = new Date(dueDateA).getTime()
      const dateB = new Date(dueDateB).getTime()
      return dateA - dateB
    },
    cell: ({ row }) => {
      if (!row.getValue('due_date')) return 'N/A'

      return new Date(row.getValue('due_date')).toLocaleString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }
  },
  {
    accessorKey: 'completed',
    header: 'Completed',
    cell: ({ row }) => {
      const completed = row.getValue<boolean>('completed')

      return h(
        UBadge,
        {
          class: 'capitalize',
          variant: 'subtle',
          color: completed ? 'success' : 'error'
        },
        () => completed ? 'Completed' : 'Pending')
    }
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => row.getValue('title')
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => row.getValue('category')
  },
  {
    id: 'actions',
    meta: {
      class: {
        td: 'text-right'
      }
    },
    cell: ({ row }) => {
      return h(UDropdownMenu, {
        'content': {
          align: 'end'
        },
        'items': getRowItems(row),
        'aria-label': 'Actions dropdown'
      },
      () => h(UButton, {
        'icon': 'i-lucide-ellipsis-vertical',
        'color': 'neutral',
        'variant': 'ghost',
        'aria-label': 'Actions'
      })
      )
    }
  }
]
</script>

<template>
  <div>
    <h2>Table</h2>
    <div class="flex-1 divide-y divide-accented w-full">
      <UTable
        ref="table"
        :data=" data "
        :columns=" columns "
        :sorting=" sorting "
        class="h-96"
      >
        <template #expanded="{ row }">
          <p class="font-bold mb-4">
            Details:
          </p>
          <pre>{{ row.original }}</pre>
        </template>
      </UTable>
    </div>
  </div>
</template>
