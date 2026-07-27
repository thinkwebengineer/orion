import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendOrderConfirmation, sendShippingUpdate } from '@/lib/email'

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
 * Body: { id, fulfillment_status?, tracking_number?, notes?, payment_status?, resend_confirmation? }
 *
 * Updates a single order's fields. Only provided fields are changed.
 * Fires transactional emails in the background:
 *   - Shipping update when fulfillment_status='shipped' and tracking_number is set
 *   - Resend confirmation when resend_confirmation=true
 */
export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const { id, fulfillment_status, tracking_number, notes, payment_status, resend_confirmation } = body

  if (!id) return NextResponse.json({ error: 'Order ID required' }, { status: 400 })

  const supabase = createAdminClient()

  // Fetch the current order so we have email/shipping_name/items for email dispatch
  const { data: existing, error: fetchError } = await supabase
    .from('orders')
    .select('email, shipping_name, items, fulfillment_status, tracking_number')
    .eq('id', id)
    .single()

  if (fetchError) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const updates: Record<string, unknown> = {}
  if (fulfillment_status !== undefined) updates.fulfillment_status = fulfillment_status
  if (tracking_number !== undefined) updates.tracking_number = tracking_number
  if (notes !== undefined) updates.notes = notes
  if (payment_status !== undefined) updates.payment_status = payment_status
  updates.updated_at = new Date().toISOString()

  const { error } = await supabase.from('orders').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // ── Background email dispatch ──────────────────────────────────────────

  const resolvedStatus = fulfillment_status ?? existing.fulfillment_status
  const resolvedTracking = tracking_number ?? existing.tracking_number

  // Shipping update: status changed to 'shipped' AND tracking is now set
  if (
    resolvedStatus === 'shipped' &&
    resolvedTracking &&
    resolvedTracking.length > 0 &&
    fulfillment_status !== undefined
  ) {
    const nameParts = (existing.shipping_name || '').split(' ')
    const firstName = nameParts[0] || existing.shipping_name
    sendShippingUpdate({
      email: existing.email,
      orderId: id,
      trackingNumber: resolvedTracking,
      shippingName: firstName,
    }).catch((err: unknown) => {
      console.error('Failed to send shipping update email:', err)
    })
  }

  // Resend confirmation button in admin
  if (resend_confirmation === true) {
    const items = (existing.items || []) as { name?: string; quantity?: number; price?: number }[]
    const nameParts = (existing.shipping_name || '').split(' ')
    const firstName = nameParts[0] || existing.shipping_name
    const lastName = nameParts.slice(1).join(' ') || ''
    sendOrderConfirmation({
      email: existing.email,
      orderId: id,
      items,
      shipping: { firstName, lastName },
    }).catch((err: unknown) => {
      console.error('Failed to resend order confirmation email:', err)
    })
  }

  return NextResponse.json({ success: true })
}
