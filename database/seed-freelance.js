import { clearTables, insertRows } from './seed-helpers.js'

await clearTables(['freelance_workflows'])

await insertRows('freelance_workflows', [
  { workflow: 'Clients and contacts', status: 'future', priority: 'low', notes: 'Only build after household v1 is useful.' },
  { workflow: 'Invoices and payments', status: 'reserved', priority: 'low', notes: 'Could overlap with budgeting later.' },
  { workflow: 'Tax notes and exports', status: 'reserved', priority: 'low', notes: 'Keep as a possible future workspace.' }
])

console.log('Freelance seed completed.')
