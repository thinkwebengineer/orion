'use client';

import { useState } from 'react';

export interface PaymentData {
  method: 'card' | 'crypto' | 'bank_transfer';
  nameOnOrder: string;
}

interface PaymentFormProps {
  data: PaymentData;
  onChange: (data: PaymentData) => void;
  onBack: () => void;
  onNext: () => void;
}

const PAYMENT_OPTIONS = [
  {
    value: 'card' as const,
    label: 'Pay with card',
    sublabel: 'Stripe — coming soon',
    disabled: false,
  },
  {
    value: 'crypto' as const,
    label: 'Pay with crypto',
    sublabel: 'Bitcoin, Ethereum & more — coming soon',
    disabled: true,
  },
  {
    value: 'bank_transfer' as const,
    label: 'Pay by bank transfer',
    sublabel: 'Direct bank deposit — coming soon',
    disabled: true,
  },
];

export const DEFAULT_PAYMENT_DATA: PaymentData = {
  method: 'card',
  nameOnOrder: '',
};

export default function PaymentForm({
  data,
  onChange,
  onBack,
  onNext,
}: PaymentFormProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const update = (field: keyof PaymentData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const inputClass = (field: string) => {
    const base =
      'w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all duration-200 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500';
    const focusRing =
      focusedField === field
        ? 'border-amber-400 ring-2 ring-amber-400/20'
        : 'border-zinc-700 hover:border-zinc-600';
    return `${base} ${focusRing}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-100">Payment</h2>

      {/* Payment method selection */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Payment Method
        </h3>
        <div className="space-y-3">
          {PAYMENT_OPTIONS.map((option) => {
            const isSelected = data.method === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-colors ${
                  isSelected
                    ? 'border-amber-400/50 bg-amber-400/5'
                    : option.disabled
                      ? 'border-zinc-700 bg-zinc-800/30 opacity-60'
                      : 'border-zinc-700 bg-zinc-800/30 hover:border-zinc-600'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => update('method', option.value)}
                  disabled={option.disabled}
                  className="mt-0.5 h-4 w-4 accent-amber-400"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-medium ${
                        option.disabled ? 'text-zinc-400' : 'text-zinc-100'
                      }`}
                    >
                      {option.label}
                    </span>
                    {option.disabled && (
                      <span className="text-xs text-zinc-500">Coming soon</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-zinc-400">
                    {option.sublabel}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Name on Order */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Order Details
        </h3>
        <div>
          <label
            htmlFor="payment-nameOnOrder"
            className="mb-1.5 block text-sm font-medium text-zinc-300"
          >
            Name on Order
          </label>
          <input
            id="payment-nameOnOrder"
            type="text"
            value={data.nameOnOrder}
            onChange={(e) => update('nameOnOrder', e.target.value)}
            onFocus={() => setFocusedField('nameOnOrder')}
            onBlur={() => setFocusedField(null)}
            placeholder="John Appleseed"
            className={inputClass('nameOnOrder')}
            autoComplete="name"
          />
          <p className="mt-1.5 text-xs text-zinc-500">
            We don&apos;t process real payments yet. Your order will be
            confirmed and we&apos;ll follow up with payment instructions.
          </p>
        </div>
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
          type="submit"
          className="rounded-lg bg-amber-400 px-8 py-3 font-semibold text-black transition-all duration-200 hover:bg-amber-500 hover:shadow-[0_0_12px_rgba(251,191,36,0.4)]"
        >
          Continue to Review
        </button>
      </div>
    </form>
  );
}
