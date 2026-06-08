import { addDays, clearTables, formatDate, insertRows } from './seed-helpers.js'

await clearTables(['dashboard_attention_items'])

await insertRows('dashboard_attention_items', [
  { item: 'Planting tasks due soon', domain: 'gardening', status: 'due_soon', due_date: formatDate(addDays(new Date(), 2)), notes: 'Seed tasks pull from gardening.' },
  { item: 'Replace HVAC filter', domain: 'maintenance', status: 'due_soon', due_date: formatDate(addDays(new Date(), 7)), notes: 'Maintenance task queue.' },
  { item: 'Guest bath refresh blocked', domain: 'improvements', status: 'blocked', due_date: null, notes: 'Needs paint decision.' },
  { item: 'Settle shared bills', domain: 'budgeting', status: 'needs_review', due_date: formatDate(addDays(new Date(), 7)), notes: 'Mortgage and shared card difference.' }
])

console.log('Dashboard seed completed.')
