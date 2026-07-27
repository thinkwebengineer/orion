import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendOrderConfirmation } from '@/lib/email';

// ── Validation helpers ──────────────────────────────────────────────────────

const REQUIRED_SHIPPING_FIELDS = [
  'email',
  'firstName',
  'lastName',
  'streetAddress',
  'city',
  'state',
  'zip',
] as const;

interface ShippingInput {
  email: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  aptUnit?: string;
  city: string;
  state: string;
  zip: string;
  shippingMethod: 'standard' | 'expedited';
}

interface OrderInput {
  items: unknown[];
  shipping: ShippingInput;
  subtotal: number;
  shipping_cost: number;
  total: number;
  payment_method?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateOrder(body: unknown): { data: OrderInput; error: null } | { data: null; error: string } {
  if (!isRecord(body)) {
    return { data: null, error: 'Request body must be a JSON object' };
  }

  // Validate items
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return { data: null, error: 'items must be a non-empty array' };
  }

  // Validate shipping
  if (!isRecord(body.shipping)) {
    return { data: null, error: 'shipping must be an object' };
  }

  for (const field of REQUIRED_SHIPPING_FIELDS) {
    const value = (body.shipping as Record<string, unknown>)[field];
    if (typeof value !== 'string' || value.trim() === '') {
      return { data: null, error: `shipping.${field} is required` };
    }
  }

  const shipping = body.shipping as Record<string, unknown>;
  const shippingMethod = shipping.shippingMethod;
  if (shippingMethod !== 'standard' && shippingMethod !== 'expedited') {
    return { data: null, error: 'shipping.shippingMethod must be "standard" or "expedited"' };
  }

  // Validate numeric fields
  if (typeof body.subtotal !== 'number' || isNaN(body.subtotal)) {
    return { data: null, error: 'subtotal must be a number' };
  }
  if (typeof body.shipping_cost !== 'number' || isNaN(body.shipping_cost)) {
    return { data: null, error: 'shipping_cost must be a number' };
  }
  if (typeof body.total !== 'number' || isNaN(body.total)) {
    return { data: null, error: 'total must be a number' };
  }

  const payment_method = typeof body.payment_method === 'string' ? body.payment_method : undefined;

  return {
    data: {
      items: body.items,
      shipping: {
        email: shipping.email as string,
        firstName: shipping.firstName as string,
        lastName: shipping.lastName as string,
        streetAddress: shipping.streetAddress as string,
        aptUnit: typeof shipping.aptUnit === 'string' ? shipping.aptUnit : undefined,
        city: shipping.city as string,
        state: shipping.state as string,
        zip: shipping.zip as string,
        shippingMethod: shippingMethod as 'standard' | 'expedited',
      },
      subtotal: body.subtotal,
      shipping_cost: body.shipping_cost,
      total: body.total,
      payment_method,
    },
    error: null,
  };
}

// ── POST /api/orders ─────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON in request body' }, { status: 400 });
  }

  const validation = validateOrder(body);
  if (validation.error) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  const input = validation.data!;

  const supabase = createAdminClient();

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id: null, // Guest checkout
      email: input.shipping.email,
      shipping_name: `${input.shipping.firstName} ${input.shipping.lastName}`.trim(),
      street: input.shipping.aptUnit
        ? `${input.shipping.streetAddress}, ${input.shipping.aptUnit}`
        : input.shipping.streetAddress,
      city: input.shipping.city,
      state: input.shipping.state,
      zip: input.shipping.zip,
      items: JSON.parse(JSON.stringify(input.items)),
      subtotal: input.subtotal,
      shipping: input.shipping_cost,
      tax: 0,
      total: input.total,
      payment_method: input.payment_method ?? null,
      payment_status: 'pending',
      fulfillment_status: 'pending',
    })
    .select('id, created_at')
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    return Response.json(
      { error: 'Failed to create order. Please try again.' },
      { status: 500 },
    );
  }

  // Fire order confirmation email in the background (non-blocking)
  sendOrderConfirmation({
    email: input.shipping.email,
    orderId: order.id,
    items: input.items as { name?: string; quantity?: number; price?: number }[],
    shipping: {
      firstName: input.shipping.firstName,
      lastName: input.shipping.lastName,
    },
  }).catch((err) => {
    console.error('Failed to send order confirmation email:', err);
  });

  return Response.json(
    { order_id: order.id, created_at: order.created_at },
    { status: 201 },
  );
}
