import { faker } from '@faker-js/faker'
import { addDays, clearTables, formatDate, insertRows, money, pick } from './seed-helpers.js'

await clearTables([
  'home_improvement_todos',
  'home_improvement_projects'
])

const today = new Date()
const projects = await insertRows('home_improvement_projects', [
  'Office shelves',
  'Guest bath refresh',
  'Garden bed rebuild',
  'Mudroom hooks',
  'Garage storage wall',
  'Deck step repair'
].map((title, index) => ({
  title,
  description: faker.lorem.sentence(),
  status: index === 1 ? 'blocked' : pick(['idea', 'planned', 'in_progress']),
  priority: pick(['low', 'medium', 'high']),
  area: pick(['Office', 'Bathroom', 'Yard', 'Garage', 'Exterior', 'Whole home']),
  target_start_date: formatDate(addDays(today, faker.number.int({ min: 5, max: 60 }))),
  target_end_date: formatDate(addDays(today, faker.number.int({ min: 30, max: 180 }))),
  estimated_total: money(150, 3200),
  actual_total: faker.datatype.boolean({ probability: 0.45 }) ? money(75, 1800) : null,
  notes: faker.lorem.paragraph()
})))

await insertRows('home_improvement_todos', projects.flatMap((project, projectIndex) => (
  Array.from({ length: faker.number.int({ min: 2, max: 4 }) }, (_, index) => ({
    project_id: project.id,
    title: pick(['Measure space', 'Choose finish', 'Buy materials', 'Schedule work block', 'Compare prices', 'Clean up project area']),
    notes: faker.lorem.sentence(),
    status: index === 0 && projectIndex % 2 === 0 ? 'in_progress' : pick(['pending', 'pending', 'completed']),
    due_date: formatDate(addDays(today, faker.number.int({ min: 3, max: 75 }))),
    completed_at: faker.datatype.boolean({ probability: 0.25 }) ? addDays(today, -faker.number.int({ min: 1, max: 30 })).toISOString() : null,
    sort_order: index
  }))
)))

console.log('Home improvement seed completed.')
