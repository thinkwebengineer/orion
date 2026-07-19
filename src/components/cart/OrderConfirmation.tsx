'use client';

import Link from 'next/link';
import { HiOutlineShoppingBag } from 'react-icons/hi2';

interface OrderConfirmationProps {
  orderJson: Record<string, unknown>;
}

function generateOrderNumber(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

export default function OrderConfirmation({
  orderJson,
}: OrderConfirmationProps) {
  const orderNumber = generateOrderNumber();
  const estimatedDelivery = 'Estimated delivery: 3-5 business days';

  return (
    <div className="space-y-8">
      {/* Success message */}
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <svg
            className="h-8 w-8 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-zinc-100">Order Confirmed!</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
      </div>

      {/* Order number + delivery */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-center">
        <p className="text-xs uppercase tracking-widest text-zinc-500">
          Order Number
        </p>
        <p className="mt-1 text-2xl font-mono font-bold text-amber-400">
          #{orderNumber}
        </p>
        <p className="mt-3 text-sm text-zinc-400">{estimatedDelivery}</p>
      </div>

      {/* Styled JSON blob */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Order Details
        </h3>
        <pre className="overflow-x-auto rounded-lg bg-black/60 p-4 text-xs leading-relaxed">
          <code className="text-zinc-300">
            {JSON.stringify(orderJson, null, 2)}
          </code>
        </pre>
      </div>

      {/* Action */}
      <div className="flex justify-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-8 py-3 font-semibold text-black transition-all duration-200 hover:bg-amber-500 hover:shadow-[0_0_12px_rgba(251,191,36,0.4)]"
        >
          <HiOutlineShoppingBag className="h-5 w-5" />
          Start New Order
        </Link>
      </div>
    </div>
  );
}
