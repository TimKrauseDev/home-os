import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
)

export const clearTables = async (tables) => {
  for (const table of tables) {
    const { error } = await supabase
      .from(table)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (error) throw new Error(`Could not clear table ${table}: ${error.message}`)
  }
}

export const insertRows = async (table, rows, select = '*') => {
  const { data, error } = await supabase
    .from(table)
    .insert(rows)
    .select(select)

  if (error) throw new Error(`Could not insert rows into table ${table}: ${error.message}`)

  return data
}
