import { faker } from '@faker-js/faker'
import { clearTables, insertRows } from './helpers.js'

const TODO_COUNT = 40
const categories = [
  'Cleaning',
  'Errands',
  'Finance',
  'Garden',
  'General',
  'Home',
  'Maintenance',
  'Shopping'
]

const todoTitles = [
  'Change the HVAC filter',
  'Clean the refrigerator shelves',
  'Confirm the utility payment',
  'Declutter the entryway',
  'Inspect the outdoor faucets',
  'Order household supplies',
  'Plan meals for the week',
  'Schedule the annual inspection',
  'Test smoke detector batteries',
  'Update the household budget',
  'Vacuum the upstairs rooms',
  'Water the garden beds'
]

const buildTodo = () => {
  const completed = faker.datatype.boolean({ probability: 0.35 })
  const hasDueDate = faker.datatype.boolean({ probability: 0.75 })

  return {
    due_date: hasDueDate
      ? faker.date.between({
          from: faker.date.recent({ days: 30 }),
          to: faker.date.soon({ days: 60 })
        }).toISOString()
      : null,
    title: faker.helpers.arrayElement(todoTitles),
    category: faker.helpers.arrayElement(categories),
    completed
  }
}

const seedTodos = async () => {
  faker.seed(20260917)

  await clearTables(['todos'])

  const todos = faker.helpers.multiple(buildTodo, {
    count: TODO_COUNT
  })

  await insertRows('todos', todos)

  console.log(`Seeded ${todos.length} todos.`)
}

await seedTodos()
