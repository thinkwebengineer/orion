'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import type { ShippingData } from './ShippingForm';
import type { PaymentData } from './PaymentForm';

interface OrderReviewProps {
  shipping: ShippingData;
  payment: PaymentData;
  onBack: () => void;
  onComplete: () => void;
}

const FREE_THRESHOLD = 75;
const EXPEDITED_COST = 12.99;

function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function maskCardNumber(raw: string): string {
  if (!raw) return '****';
  const last4 = raw.replace(/\D/g, '').slice(-4);
  return `****${last4}`;
}

function getShippingCost(method: 'standard' | 'expedited', subtotal: number): number {
  if (method === 'standard' && subtotal >= FREE_THRESHOLD) return 0;
  if (method === 'standard') return 0; // Standard is always free for orders of any amount per the shipping config
  return EXPEDITED_COST;
}

function getShippingLabel(method: 'standard' | 'expedited'): string {
  return method === 'standard'
    ? 'Standard (3-5 business days)'
    : 'Expedited (1-2 business days)';
}

function formatAddress(shipping: ShippingData): string {
  const parts = [shipping.firstName, shipping.lastName].filter(Boolean).join(' ');
  const addr = [shipping.streetAddress, shipping.aptUnit].filter(Boolean).join(', ');
  const cityState = [shipping.city, shipping.state].filter(Boolean).join(', ');
  const zip = shipping.zip || '';
  return [parts, addr, `${cityState} ${zip}`.trim()].filter(Boolean).join('\n');
}

export default function OrderReview({
  shipping,
  payment,
  onBack,
  onComplete,
}: OrderReviewProps) {
  const { items, subtotal } = useCart();

  const shippingCost = getShippingCost(shipping.shippingMethod, subtotal);
  const total = subtotal + shippingCost;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-100">Review Your Order</h2>

      {/* Order summary */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Order Summary
        </h3>
        <div className="divide-y divide-zinc-800">
          {items.map((item, i) => {
            const lineTotal = item.price * item.quantity;
            const uniqueKey = `${item.productId}-${item.variantLabel ?? ''}-${i}`;
            return (
              <div key={uniqueKey} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-100">
                    {item.name}
                  </p>
                  {item.variantLabel && (
                    <p className="text-xs text-zinc-500">{item.variantLabel}</p>
                  )}
                  <p className="text-xs text-zinc-500">Qty: {item.quantity}</p>
                </div>
                <span className="ml-4 text-sm font-medium text-zinc-100">
                  {formatPrice(lineTotal)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price breakdown */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Subtotal</span>
            <span className="text-zinc-100">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Shipping ({getShippingLabel(shipping.shippingMethod)})</span>
            <span className={shippingCost === 0 ? 'text-emerald-400' : 'text-zinc-100'}>
              {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
            </span>
          </div>
          <div className="border-t border-zinc-700 pt-2 flex justify-between">
            <span className="font-semibold text-zinc-100">Total</span>
            <span className="text-lg font-bold text-amber-400">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Shipping Address
        </h3>
        <pre className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-100 font-sans">
          {formatAddress(shipping) || (
            <span className="text-zinc-500 italic">No address provided</span>
          )}
        </pre>
        {shipping.email && (
          <p className="mt-2 text-sm text-zinc-400">{shipping.email}</p>
        )}
      </div>

      {/* Payment method */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Payment Method
        </h3>
        <p className="text-sm text-zinc-100">
          Credit/Debit Card ending in{' '}
          <span className="font-mono text-amber-400">
            {maskCardNumber(payment.cardNumber)}
          </span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onComplete}
          className="rounded-lg bg-amber-400 px-8 py-3 font-semibold text-black transition-all duration-200 hover:bg-amber-500 hover:shadow-[0_0_12px_rgba(251,191,36,0.4)]"
        >
          Complete Order
        </button>
      </div>
    </div>
  );
}
