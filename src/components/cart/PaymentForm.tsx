'use client';

import { useState } from 'react';

export interface PaymentData {
  method: 'card';
  cardNumber: string;
  nameOnCard: string;
  expiry: string;
  cvv: string;
}

interface PaymentFormProps {
  data: PaymentData;
  onChange: (data: PaymentData) => void;
  onBack: () => void;
  onNext: () => void;
}

export const DEFAULT_PAYMENT_DATA: PaymentData = {
  method: 'card',
  cardNumber: '',
  nameOnCard: '',
  expiry: '',
  cvv: '',
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

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join(' ') : digits;
  };

  const handleCardNumberChange = (value: string) => {
    const rawDigits = value.replace(/\D/g, '').slice(0, 16);
    onChange({ ...data, cardNumber: rawDigits });
  };

  const handleExpiryChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    let formatted = digits;
    if (digits.length >= 3) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    onChange({ ...data, expiry: formatted });
  };

  const handleCvvChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    onChange({ ...data, cvv: digits });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-100">Payment</h2>

      {/* Payment method selection */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Payment Method
        </h3>
        <div className="flex flex-wrap gap-3">
          {/* Credit/Debit Card - active */}
          <div className="flex cursor-pointer items-center gap-3 rounded-lg border border-amber-400/50 bg-amber-400/5 px-4 py-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-amber-400">
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            </div>
            <div>
              <span className="text-sm font-medium text-zinc-100">
                Credit / Debit Card
              </span>
              <div className="mt-0.5 flex gap-1 text-xs text-zinc-500">
                <span>Visa</span>
                <span className="text-zinc-700">|</span>
                <span>MC</span>
                <span className="text-zinc-700">|</span>
                <span>Amex</span>
                <span className="text-zinc-700">|</span>
                <span>Discover</span>
              </div>
            </div>
          </div>

          {/* Apple Pay - visual only */}
          <div className="flex cursor-not-allowed items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800/30 px-4 py-3 opacity-60">
            <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-zinc-600">
              <div className="h-2.5 w-2.5 rounded-full bg-transparent" />
            </div>
            <div>
              <span className="text-sm font-medium text-zinc-400">
                Apple Pay
              </span>
              <p className="text-xs text-zinc-600">Coming soon</p>
            </div>
          </div>

          {/* Google Pay - visual only */}
          <div className="flex cursor-not-allowed items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800/30 px-4 py-3 opacity-60">
            <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-zinc-600">
              <div className="h-2.5 w-2.5 rounded-full bg-transparent" />
            </div>
            <div>
              <span className="text-sm font-medium text-zinc-400">
                Google Pay
              </span>
              <p className="text-xs text-zinc-600">Coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Card details */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Card Details
        </h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="payment-cardNumber"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Card Number
            </label>
            <input
              id="payment-cardNumber"
              type="text"
              inputMode="numeric"
              value={formatCardNumber(data.cardNumber)}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              onFocus={() => setFocusedField('cardNumber')}
              onBlur={() => setFocusedField(null)}
              placeholder="1234 5678 9012 3456"
              className={inputClass('cardNumber')}
              autoComplete="cc-number"
            />
          </div>
          <div>
            <label
              htmlFor="payment-nameOnCard"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Name on Card
            </label>
            <input
              id="payment-nameOnCard"
              type="text"
              value={data.nameOnCard}
              onChange={(e) => update('nameOnCard', e.target.value)}
              onFocus={() => setFocusedField('nameOnCard')}
              onBlur={() => setFocusedField(null)}
              placeholder="John Appleseed"
              className={inputClass('nameOnCard')}
              autoComplete="cc-name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="payment-expiry"
                className="mb-1.5 block text-sm font-medium text-zinc-300"
              >
                Expiry (MM/YY)
              </label>
              <input
                id="payment-expiry"
                type="text"
                inputMode="numeric"
                value={data.expiry}
                onChange={(e) => handleExpiryChange(e.target.value)}
                onFocus={() => setFocusedField('expiry')}
                onBlur={() => setFocusedField(null)}
                placeholder="MM/YY"
                className={inputClass('expiry')}
                autoComplete="cc-exp"
              />
            </div>
            <div>
              <label
                htmlFor="payment-cvv"
                className="mb-1.5 block text-sm font-medium text-zinc-300"
              >
                CVV
              </label>
              <input
                id="payment-cvv"
                type="password"
                inputMode="numeric"
                value={data.cvv}
                onChange={(e) => handleCvvChange(e.target.value)}
                onFocus={() => setFocusedField('cvv')}
                onBlur={() => setFocusedField(null)}
                placeholder="123"
                className={inputClass('cvv')}
                autoComplete="cc-csc"
              />
            </div>
          </div>
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
