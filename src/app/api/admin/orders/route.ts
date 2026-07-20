import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/admin/orders
 *
 * Query params:
 *   ?status=pending        — filter by fulfillment_status
 *   &limit=50              — page size (default 50)
 *   &offset=0              — page offset (default 0)
 *
 * Returns: { orders: Order[], count: number }
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const limit = parseInt(searchParams.get('limit') || '50', 10)
  const offset = parseInt(searchParams.get('offset') || '0', 10)

  const supabase = createAdminClient()

  // Count query
  let countQuery = supabase.from('orders').select('*', { count: 'exact', head: true })
  if (status) countQuery = countQuery.eq('fulfillment_status', status)

  const { count, error: countError } = await countQuery
  if (countError) return NextResponse.json({ error: countError.message }, { status: 500 })

  // Data query
  let dataQuery = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) dataQuery = dataQuery.eq('fulfillment_status', status)

  const { data: orders, error } = await dataQuery
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ orders, count })
}

/**
 * PATCH /api/admin/orders
 *
 * Body: { id, fulfillment_status?, tracking_number?, notes?, payment_status? }
 *
 * Updates a single order's fields. Only provided fields are changed.
 */
export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const { id, fulfillment_status, tracking_number, notes, payment_status } = body

  if (!id) return NextResponse.json({ error: 'Order ID required' }, { status: 400 })

  const supabase = createAdminClient()
  const updates: Record<string, unknown> = {}
  if (fulfillment_status !== undefined) updates.fulfillment_status = fulfillment_status
  if (tracking_number !== undefined) updates.tracking_number = tracking_number
  if (notes !== undefined) updates.notes = notes
  if (payment_status !== undefined) updates.payment_status = payment_status
  updates.updated_at = new Date().toISOString()

  const { error } = await supabase.from('orders').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
