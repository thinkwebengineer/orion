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

const SEED_SQL = readFileSync(resolve(import.meta.dirname, '../supabase/seed.sql'), 'utf-8')

// Extract product INSERT statements (skip the admin user profile insert)
const lines = SEED_SQL.split('\n')
const insertBlocks: string[] = []
let currentBlock: string[] = []
let inInsert = false

for (const line of lines) {
  if (line.startsWith('INSERT INTO products')) {
    inInsert = true
    currentBlock = [line]
  } else if (inInsert) {
    currentBlock.push(line)
    if (line.trim() === ');') {
      insertBlocks.push(currentBlock.join('\n'))
      inInsert = false
      currentBlock = []
    }
  }
}

async function run() {
  console.log(`Found ${insertBlocks.length} product insert blocks`)

  for (let i = 0; i < insertBlocks.length; i++) {
    const block = insertBlocks[i]
    // Parse values: extract the VALUES (...) part
    const valuesMatch = block.match(/VALUES\s*\n?\((.*)\);\s*$/s)
    if (!valuesMatch) {
      console.log(`Block ${i}: could not parse values, skipping`)
      continue
    }

    // Use exec_sql via the REST API directly
    const { error } = await supabase.from('products').insert({}).single()
    // Actually let's try a different approach - parse each product and insert via JSON

    console.log(`Block ${i}: ${block.substring(0, 80)}...`)
  }

  // Alternative approach: read the JSON file and insert each product
  console.log('\n--- Alternative: Insert from JSON ---')
  const productsJson = readFileSync(resolve(import.meta.dirname, '../src/data/products.json'), 'utf-8')
  const products = JSON.parse(productsJson)

  let inserted = 0
  for (const product of products) {
    const { error } = await supabase.from('products').insert({
      name: product.name,
      subtitle: product.subtitle || null,
      brand: product.brand || 'golden-mycology',
      category: product.category,
      subcategory: product.subcategory || null,
      price: product.price,
      variants: product.variants || [],
      rating: product.rating || 0,
      review_count: product.reviewCount || 0,
      description: product.description || null,
      features: product.features || [],
      images: product.images || [],
      inventory: product.inventory ?? null,
      for_microscopy_only: product.forMicroscopyOnly ?? true,
      featured: product.featured || false,
      tags: product.tags || [],
      specs: product.specs || {},
    })

    if (error) {
      console.log(`Failed: ${product.name} — ${error.message}`)
    } else {
      inserted++
    }
  }

  console.log(`\nInserted ${inserted}/${products.length} products`)
  
  // Verify
  const { data, count } = await supabase.from('products').select('*', { count: 'exact', head: true })
  console.log(`Total products in DB: ${count}`)
}

run().catch(console.error)
