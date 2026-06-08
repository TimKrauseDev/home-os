import { clearTables, insertRows } from './seed-helpers.js'

await clearTables([
  'security_controls',
  'notification_rules',
  'app_settings',
  'household_members'
])

await insertRows('household_members', [
  { name: 'Self', role: 'owner', email: '', budget_owner: 'self', receives_email: true, notes: '' },
  { name: 'Spouse', role: 'household_member', email: '', budget_owner: 'spouse', receives_email: true, notes: '' }
])

await insertRows('app_settings', [
  { setting: 'Household Name', value: 'Home OS', area: 'household', notes: 'Internal household app name.' },
  { setting: 'Garden Location', value: 'Ebony, VA', area: 'gardening', notes: 'Used for frost-date planning later.' },
  { setting: 'Database', value: 'Hosted Supabase', area: 'database', notes: 'Managed backups are preferred.' },
  { setting: 'Hosting', value: 'Local dev now, Raspberry Pi later', area: 'hosting', notes: 'Keep household-only access.' }
])

await insertRows('notification_rules', [
  { domain: 'Gardening', channel: 'email', timing: 'Daily scan', enabled: true, notes: 'Planting tasks and sow windows.' },
  { domain: 'Maintenance', channel: 'email', timing: 'Daily scan', enabled: true, notes: 'Due and overdue recurring tasks.' },
  { domain: 'Budgeting', channel: 'email', timing: 'Weekly', enabled: false, notes: 'Settlement tasks later.' }
])

await insertRows('security_controls', [
  { control: 'Private household access', status: 'active', area: 'hosting', notes: 'Development runs locally.' },
  { control: 'Authentication before public access', status: 'planned', area: 'auth', notes: 'Do not expose publicly without auth.' },
  { control: 'Supabase managed backups', status: 'active', area: 'data', notes: 'Hosted Supabase remains persistence backbone.' }
])

console.log('Settings seed completed.')
