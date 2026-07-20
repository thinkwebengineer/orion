import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/admin/products
 *
 * Query params:
 *   ?category=genetics     — filter by category
 *   &featured=true         — only featured
 *   &limit=100             — page size (default 100)
 *   &offset=0              — page offset (default 0)
 *
 * Returns: { products: Product[], count: number }
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const limit = parseInt(searchParams.get('limit') || '100', 10)
  const offset = parseInt(searchParams.get('offset') || '0', 10)

  const supabase = createAdminClient()

  let countQuery = supabase.from('products').select('*', { count: 'exact', head: true })
  if (category) countQuery = countQuery.eq('category', category)
  if (featured === 'true') countQuery = countQuery.eq('featured', true)

  const { count, error: countError } = await countQuery
  if (countError) return NextResponse.json({ error: countError.message }, { status: 500 })

  let dataQuery = supabase
    .from('products')
    .select('*')
    .order('name', { ascending: true })
    .range(offset, offset + limit - 1)

  if (category) dataQuery = dataQuery.eq('category', category)
  if (featured === 'true') dataQuery = dataQuery.eq('featured', true)

  const { data: products, error } = await dataQuery
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ products, count })
}

/**
 * POST /api/admin/products
 *
 * Body: Product fields (minus id/rating/reviewCount/created_at)
 *
 * Creates a new product in the Supabase products table.
 */
export async function POST(request: NextRequest) {
  const body = await request.json()

  // Validate required fields
  const requiredFields = ['name', 'brand', 'category', 'subcategory', 'price', 'description']
  for (const field of requiredFields) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
    }
  }

  const supabase = createAdminClient()

  const product = {
    name: body.name,
    subtitle: body.subtitle || null,
    brand: body.brand,
    category: body.category,
    subcategory: body.subcategory,
    price: Number(body.price),
    variants: body.variants || [],
    rating: 0,
    review_count: 0,
    description: body.description,
    features: body.features || [],
    images: body.images || [],
    for_microscopy_only: body.forMicroscopyOnly ?? body.for_microscopy_only ?? false,
    featured: body.featured ?? false,
    tags: body.tags || [],
    inventory: body.inventory !== undefined && body.inventory !== '' ? Number(body.inventory) : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from('products').insert(product).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ product: data }, { status: 201 })
}
