import { faker } from '@faker-js/faker'
import { addDays, clearTables, formatDate, insertRows, money, pick } from './seed-helpers.js'

await clearTables([
  'budget_savings_bucket_activity',
  'budget_savings_buckets',
  'budget_settlement_task_transactions',
  'budget_settlement_tasks',
  'budget_transactions',
  'budget_transaction_imports',
  'budget_merchants',
  'budget_categories',
  'budget_accounts'
])

const accounts = await insertRows('budget_accounts', [
  { name: 'Checking', owner: 'self', account_type: 'checking', institution: 'Local Bank', current_balance: money(2500, 7000), available_balance: money(2500, 7000), is_active: true, notes: '' },
  { name: 'Shared Credit Card', owner: 'spouse', account_type: 'credit_card', institution: 'Card Bank', current_balance: -money(300, 1600), available_balance: money(3000, 9000), is_active: true, notes: 'Shared household expenses.' },
  { name: 'House Savings', owner: 'joint', account_type: 'savings', institution: 'Local Bank', current_balance: money(5000, 18000), available_balance: money(5000, 18000), is_active: true, notes: '' },
  { name: 'Cash', owner: 'household', account_type: 'cash', institution: 'Envelope', current_balance: money(50, 500), available_balance: null, is_active: true, notes: '' }
])

const categories = await insertRows('budget_categories', [
  ['Income', 'Income', 'income', null, 'track_only'],
  ['Mortgage', 'Housing', 'expense', 2000, 'spend_exactly'],
  ['Groceries', 'Food', 'expense', 750, 'keep_under'],
  ['Restaurants', 'Food', 'expense', 250, 'keep_under'],
  ['Utilities', 'Housing', 'expense', 325, 'keep_under'],
  ['Garden', 'Home', 'expense', 150, 'keep_under'],
  ['Vacation', 'Savings', 'savings', 300, 'save_at_least'],
  ['Transfer', 'Transfers', 'transfer', null, 'track_only']
].map(([name, groupName, categoryType, goal, behavior], index) => ({
  name,
  group_name: groupName,
  category_type: categoryType,
  monthly_goal_amount: goal,
  goal_behavior: behavior,
  is_active: true,
  sort_order: index,
  notes: ''
})))

const categoryByName = new Map(categories.map(category => [category.name, category]))
const merchants = await insertRows('budget_merchants', [
  { name: 'Mortgage Servicer', default_category_id: categoryByName.get('Mortgage').id, notes: '' },
  { name: 'Grocery Store', default_category_id: categoryByName.get('Groceries').id, notes: '' },
  { name: 'Hardware Shop', default_category_id: categoryByName.get('Garden').id, notes: '' },
  { name: 'Power Company', default_category_id: categoryByName.get('Utilities').id, notes: '' },
  { name: 'Employer', default_category_id: categoryByName.get('Income').id, notes: '' },
  { name: 'Coffee Place', default_category_id: categoryByName.get('Restaurants').id, notes: '' }
])

const imports = await insertRows('budget_transaction_imports', accounts.slice(0, 2).map((account, index) => ({
  account_id: account.id,
  file_name: index === 0 ? 'checking-june.csv' : 'shared-card-june.csv',
  institution: account.institution,
  imported_at: addDays(new Date(), -faker.number.int({ min: 0, max: 7 })).toISOString(),
  row_count: faker.number.int({ min: 28, max: 82 }),
  created_count: faker.number.int({ min: 25, max: 78 }),
  skipped_count: faker.number.int({ min: 0, max: 4 }),
  notes: faker.datatype.boolean({ probability: 0.4 }) ? 'Some duplicate rows skipped.' : ''
})))

const transactions = await insertRows('budget_transactions', Array.from({ length: 34 }, (_, index) => {
  const merchant = pick(merchants)
  const account = pick(accounts)
  const category = categories.find(item => item.id === merchant.default_category_id)
  const isIncome = merchant.name === 'Employer'

  return {
    account_id: account.id,
    category_id: category?.id ?? null,
    merchant_id: merchant.id,
    import_id: pick(imports).id,
    transaction_date: formatDate(addDays(new Date(), -faker.number.int({ min: 0, max: 45 }))),
    description: isIncome ? 'Paycheck' : `${merchant.name} purchase`,
    merchant: merchant.name,
    amount: isIncome ? money(1800, 4200) : -money(12, merchant.name === 'Mortgage Servicer' ? 2200 : 450),
    transaction_type: isIncome ? 'income' : 'expense',
    status: pick(['pending', 'cleared', 'reviewed', 'reviewed']),
    external_id: `fake-${String(index + 1).padStart(4, '0')}`,
    raw_import_data: { source: 'faker', row: index + 1 },
    notes: faker.datatype.boolean({ probability: 0.15 }) ? faker.lorem.sentence() : ''
  }
}))

const settlements = await insertRows('budget_settlement_tasks', [
  { title: 'Mortgage and shared card difference', payer: 'Spouse', recipient: 'Self', source_type: 'balance_difference', basis_amount: 1500, share_type: 'half', amount_due: 750, due_date: formatDate(addDays(new Date(), 7)), status: 'pending', notes: 'Derived from net shared household payments.' },
  { title: 'Garden supplies split', payer: 'Self', recipient: 'Spouse', source_type: 'purchase_share', basis_amount: 120, share_type: 'half', amount_due: 60, due_date: formatDate(addDays(new Date(), 14)), status: 'pending', notes: faker.lorem.sentence() }
])

await insertRows('budget_settlement_task_transactions', settlements.flatMap(settlement => (
  faker.helpers.arrayElements(transactions, { min: 2, max: 4 }).map(transaction => ({
    settlement_task_id: settlement.id,
    transaction_id: transaction.id
  }))
)))

const buckets = await insertRows('budget_savings_buckets', [
  { name: 'Fun Money', owner: 'self', target_amount: 300, current_amount: 300, status: 'active', notes: '' },
  { name: 'Vacation', owner: 'joint', target_amount: 4000, current_amount: 2200, status: 'active', notes: '' },
  { name: 'Furniture', owner: 'joint', target_amount: 2500, current_amount: 1400, status: 'active', notes: '' },
  { name: 'House Repairs', owner: 'household', target_amount: 5000, current_amount: 1800, status: 'active', notes: faker.lorem.sentence() }
])

await insertRows('budget_savings_bucket_activity', buckets.flatMap(bucket => (
  Array.from({ length: 3 }, () => ({
    bucket_id: bucket.id,
    transaction_id: faker.datatype.boolean({ probability: 0.3 }) ? pick(transactions).id : null,
    activity_date: formatDate(addDays(new Date(), -faker.number.int({ min: 1, max: 90 }))),
    activity_type: pick(['allocation', 'withdrawal', 'adjustment']),
    amount: money(25, 400),
    notes: faker.lorem.sentence()
  }))
)))

console.log('Budgeting seed completed.')
