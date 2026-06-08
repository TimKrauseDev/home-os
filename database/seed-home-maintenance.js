import { faker } from '@faker-js/faker'
import { addDays, clearTables, formatDate, insertRows, pick } from './seed-helpers.js'

const today = new Date()

await clearTables([
  'home_maintenance_completions',
  'home_maintenance_task_cadences',
  'home_maintenance_tasks'
])

const tasks = await insertRows('home_maintenance_tasks', [
  {
    title: 'Replace HVAC filter',
    description: 'Swap the main return filter.',
    area: 'interior',
    next_due_date: formatDate(addDays(today, 7)),
    status: 'active',
    priority: 'high',
    notes: '20x25x1 filter in the utility closet.'
  },
  {
    title: 'Clean windows',
    description: 'Wash glass and tracks.',
    area: 'exterior',
    next_due_date: formatDate(addDays(today, 96)),
    status: 'active',
    priority: 'medium',
    notes: 'Spring and fall cadence.'
  },
  {
    title: 'Clean dryer vent',
    description: 'Clear lint from hose and exterior flap.',
    area: 'interior',
    next_due_date: formatDate(addDays(today, 23)),
    status: 'in_progress',
    priority: 'high',
    notes: faker.lorem.sentence()
  },
  ...Array.from({ length: 7 }, () => ({
    title: pick(['Clean gutters', 'Inspect smoke detectors', 'Flush water heater', 'Check exterior caulk', 'Service mower', 'Deep clean range hood', 'Inspect attic vents']),
    description: faker.lorem.sentence(),
    area: pick(['interior', 'exterior']),
    next_due_date: formatDate(addDays(today, faker.number.int({ min: 5, max: 180 }))),
    status: pick(['active', 'active', 'active', 'in_progress', 'paused']),
    priority: pick(['low', 'medium', 'high']),
    notes: faker.lorem.sentence()
  }))
])

await insertRows('home_maintenance_task_cadences', tasks.flatMap((task) => {
  if (task.title === 'Clean windows' || task.title === 'Clean gutters') {
    return ['spring', 'fall'].map(season => ({
      task_id: task.id,
      cadence_type: 'seasonal',
      season,
      notes: `${season} reminder.`
    }))
  }

  return [{
    task_id: task.id,
    cadence_type: pick(['monthly', 'yearly', 'custom']),
    cadence_interval: faker.number.int({ min: 1, max: 6 }),
    cadence_unit: pick(['months', 'years']),
    preferred_day: faker.number.int({ min: 1, max: 28 }),
    notes: faker.lorem.sentence()
  }]
}))

await insertRows('home_maintenance_completions', tasks.slice(0, 7).map(task => ({
  task_id: task.id,
  completed_at: addDays(today, -faker.number.int({ min: 7, max: 120 })).toISOString(),
  completed_by: pick(['Self', 'Spouse']),
  notes: faker.lorem.sentence()
})))

console.log('Home maintenance seed completed.')
