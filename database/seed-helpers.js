import { createClient } from '@supabase/supabase-js'
import { faker } from '@faker-js/faker'

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
)

export const formatDate = date => date.toISOString().split('T')[0]

export const addDays = (date, days) => {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)

  return nextDate
}

export const pick = values => faker.helpers.arrayElement(values)

export const money = (min, max) => faker.number.float({ min, max, fractionDigits: 2 })

export const clearTables = async (tables) => {
  for (const table of tables) {
    const { error } = await supabase
      .from(table)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (error) throw new Error(`Could not clear ${table}: ${error.message}`)
  }
}

export const insertRows = async (table, rows, select = '*') => {
  const { data, error } = await supabase
    .from(table)
    .insert(rows)
    .select(select)

  if (error) throw new Error(`Could not seed ${table}: ${error.message}`)

  return data
}
