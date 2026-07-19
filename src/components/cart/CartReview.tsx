'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import {
  HiOutlineTrash,
  HiOutlineMinus,
  HiOutlinePlus,
  HiOutlineShoppingBag,
} from 'react-icons/hi2';

interface CartReviewProps {
  onNext: () => void;
}

function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export default function CartReview({ onNext }: CartReviewProps) {
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
  } = useCart();

  // ── Empty state ──────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800/50">
          <HiOutlineShoppingBag className="h-10 w-10 text-zinc-500" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-zinc-100">
          Your cart is empty
        </h3>
        <p className="mb-8 max-w-sm text-sm text-zinc-400">
          Looks like you haven&apos;t added anything yet. Browse our collection
          of premium mycology supplies and genetics.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-6 py-3 font-medium text-black transition-all duration-200 hover:bg-amber-500 hover:shadow-[0_0_12px_rgba(251,191,36,0.4)]"
        >
          <HiOutlineShoppingBag className="h-5 w-5" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-100">Shopping Cart</h2>

      {/* Cart items list */}
      <div className="divide-y divide-zinc-800 overflow-hidden rounded-xl border border-zinc-800">
        {items.map((item, index) => {
          const lineTotal = item.price * item.quantity;
          const uniqueKey = `${item.productId}-${item.variantLabel ?? ''}-${index}`;

          return (
            <div
              key={uniqueKey}
              className="flex items-center gap-4 bg-zinc-900/50 p-4 transition-colors sm:p-5"
            >
              {/* Product image */}
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-800 sm:h-20 sm:w-20">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-zinc-600">
                    <HiOutlineShoppingBag className="h-8 w-8" />
                  </div>
                )}
              </div>

              {/* Item details */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-medium text-zinc-100">
                  {item.name}
                </h3>
                {item.variantLabel && (
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {item.variantLabel}
                  </p>
                )}
                <p className="mt-0.5 text-sm text-zinc-400">
                  {formatPrice(item.price)} each
                </p>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    if (item.quantity <= 1) {
                      removeItem(item.productId, item.variantLabel);
                    } else {
                      updateQuantity(
                        item.productId,
                        item.quantity - 1,
                        item.variantLabel,
                      );
                    }
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  <HiOutlineMinus className="h-4 w-4" />
                </button>
                <span className="flex h-8 w-10 items-center justify-center text-sm font-medium text-zinc-100">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(
                      item.productId,
                      item.quantity + 1,
                      item.variantLabel,
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  <HiOutlinePlus className="h-4 w-4" />
                </button>
              </div>

              {/* Line total */}
              <div className="min-w-[60px] text-right">
                <span className="text-sm font-semibold text-amber-400">
                  {formatPrice(lineTotal)}
                </span>
              </div>

              {/* Remove */}
              <button
                type="button"
                onClick={() => removeItem(item.productId, item.variantLabel)}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-red-900/20 hover:text-red-400"
                aria-label={`Remove ${item.name}`}
              >
                <HiOutlineTrash className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Subtotal */}
      <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <span className="text-base text-zinc-400">Subtotal</span>
        <span className="text-lg font-bold text-zinc-100">
          {formatPrice(subtotal)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100 sm:w-auto"
        >
          Continue Shopping
        </Link>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-400 px-8 py-3 font-semibold text-black transition-all duration-200 hover:bg-amber-500 hover:shadow-[0_0_12px_rgba(251,191,36,0.4)]"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
