import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { config } from 'dotenv'

config({ path: resolve(import.meta.dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

async function run() {
  // Run migration
  const migration = readFileSync(resolve(import.meta.dirname, '../supabase/migrations/00001_initial_schema.sql'), 'utf-8')
  console.log('Running migration...')
  const { error: mErr } = await supabase.rpc('exec_sql', { query: migration })
  if (mErr) {
    // Try direct SQL via REST
    console.log('rpc failed, trying direct SQL...')
    const { error: dErr } = await supabase.from('_exec_sql').select('*').csv()
    console.log('Direct SQL result:', dErr?.message)
  } else {
    console.log('Migration complete ✅')
  }
  
  // Run seed
  const seed = readFileSync(resolve(import.meta.dirname, '../supabase/seed.sql'), 'utf-8')
  console.log('Running seed...')
  const { error: sErr } = await supabase.rpc('exec_sql', { query: seed })
  if (sErr) {
    console.log('Seed rpc failed:', sErr.message)
  } else {
    console.log('Seed complete ✅')
  }
}

run().catch(console.error)
