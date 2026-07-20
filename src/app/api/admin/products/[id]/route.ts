import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * PATCH /api/admin/products/[id]
 *
 * Body: Partial product fields to update
 * Returns: { product: Product }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = await request.json()

  if (!id) return NextResponse.json({ error: 'Product ID required' }, { status: 400 })

  const supabase = createAdminClient()

  // Map camelCase client fields to snake_case DB columns
  const updates: Record<string, unknown> = {}
  if (body.name !== undefined) updates.name = body.name
  if (body.subtitle !== undefined) updates.subtitle = body.subtitle
  if (body.brand !== undefined) updates.brand = body.brand
  if (body.category !== undefined) updates.category = body.category
  if (body.subcategory !== undefined) updates.subcategory = body.subcategory
  if (body.price !== undefined) updates.price = Number(body.price)
  if (body.variants !== undefined) updates.variants = body.variants
  if (body.description !== undefined) updates.description = body.description
  if (body.features !== undefined) updates.features = body.features
  if (body.images !== undefined) updates.images = body.images
  if (body.forMicroscopyOnly !== undefined) updates.for_microscopy_only = body.forMicroscopyOnly
  if (body.featured !== undefined) updates.featured = body.featured
  if (body.tags !== undefined) updates.tags = body.tags
  if (body.inventory !== undefined) {
    updates.inventory = body.inventory !== '' ? Number(body.inventory) : null
  }
  updates.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ product: data })
}

/**
 * DELETE /api/admin/products/[id]
 *
 * Deletes a product by ID.
 * Returns: { success: true }
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  if (!id) return NextResponse.json({ error: 'Product ID required' }, { status: 400 })

  const supabase = createAdminClient()
  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
