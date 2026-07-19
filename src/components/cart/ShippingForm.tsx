'use client';

import { useState } from 'react';

export interface ShippingData {
  email: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  aptUnit: string;
  city: string;
  state: string;
  zip: string;
  shippingMethod: 'standard' | 'expedited';
}

interface ShippingFormProps {
  data: ShippingData;
  onChange: (data: ShippingData) => void;
  onBack: () => void;
  onNext: () => void;
}

const US_STATES = [
  { value: '', label: 'Select state' },
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

const FREE_THRESHOLD = 75;
const EXPEDITED_COST = 12.99;

export const DEFAULT_SHIPPING_DATA: ShippingData = {
  email: '',
  firstName: '',
  lastName: '',
  streetAddress: '',
  aptUnit: '',
  city: '',
  state: '',
  zip: '',
  shippingMethod: 'standard',
};

export default function ShippingForm({
  data,
  onChange,
  onBack,
  onNext,
}: ShippingFormProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof ShippingData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
      <h2 className="text-2xl font-bold text-zinc-100">
        Shipping Information
      </h2>

      {/* Contact */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Contact
        </h3>
        <div>
          <label
            htmlFor="shipping-email"
            className="mb-1.5 block text-sm font-medium text-zinc-300"
          >
            Email
          </label>
          <input
            id="shipping-email"
            type="email"
            value={data.email}
            onChange={(e) => update('email', e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            placeholder="john@example.com"
            className={inputClass('email')}
            autoComplete="email"
          />
        </div>
      </div>

      {/* Shipping address */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Shipping Address
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="shipping-firstName"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              First Name
            </label>
            <input
              id="shipping-firstName"
              type="text"
              value={data.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              onFocus={() => setFocusedField('firstName')}
              onBlur={() => setFocusedField(null)}
              placeholder="John"
              className={inputClass('firstName')}
              autoComplete="given-name"
            />
          </div>
          <div>
            <label
              htmlFor="shipping-lastName"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Last Name
            </label>
            <input
              id="shipping-lastName"
              type="text"
              value={data.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              onFocus={() => setFocusedField('lastName')}
              onBlur={() => setFocusedField(null)}
              placeholder="Appleseed"
              className={inputClass('lastName')}
              autoComplete="family-name"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="shipping-streetAddress"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Street Address
            </label>
            <input
              id="shipping-streetAddress"
              type="text"
              value={data.streetAddress}
              onChange={(e) => update('streetAddress', e.target.value)}
              onFocus={() => setFocusedField('streetAddress')}
              onBlur={() => setFocusedField(null)}
              placeholder="123 Mushroom Lane"
              className={inputClass('streetAddress')}
              autoComplete="street-address"
            />
          </div>
          <div>
            <label
              htmlFor="shipping-aptUnit"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Apt / Unit (optional)
            </label>
            <input
              id="shipping-aptUnit"
              type="text"
              value={data.aptUnit}
              onChange={(e) => update('aptUnit', e.target.value)}
              onFocus={() => setFocusedField('aptUnit')}
              onBlur={() => setFocusedField(null)}
              placeholder="Suite 42"
              className={inputClass('aptUnit')}
            />
          </div>
          <div>
            <label
              htmlFor="shipping-city"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              City
            </label>
            <input
              id="shipping-city"
              type="text"
              value={data.city}
              onChange={(e) => update('city', e.target.value)}
              onFocus={() => setFocusedField('city')}
              onBlur={() => setFocusedField(null)}
              placeholder="Portland"
              className={inputClass('city')}
              autoComplete="address-level2"
            />
          </div>
          <div>
            <label
              htmlFor="shipping-state"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              State
            </label>
            <select
              id="shipping-state"
              value={data.state}
              onChange={(e) => update('state', e.target.value)}
              onFocus={() => setFocusedField('state')}
              onBlur={() => setFocusedField(null)}
              className={`${inputClass('state')} appearance-none`}
              autoComplete="address-level1"
            >
              {US_STATES.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="shipping-zip"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              ZIP Code
            </label>
            <input
              id="shipping-zip"
              type="text"
              value={data.zip}
              onChange={(e) => update('zip', e.target.value)}
              onFocus={() => setFocusedField('zip')}
              onBlur={() => setFocusedField(null)}
              placeholder="97201"
              className={inputClass('zip')}
              autoComplete="postal-code"
            />
          </div>
        </div>
      </div>

      {/* Shipping method */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Shipping Method
        </h3>
        <div className="space-y-3">
          <label
            className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-colors ${
              data.shippingMethod === 'standard'
                ? 'border-amber-400/50 bg-amber-400/5'
                : 'border-zinc-700 bg-zinc-800/30 hover:border-zinc-600'
            }`}
          >
            <input
              type="radio"
              name="shippingMethod"
              value="standard"
              checked={data.shippingMethod === 'standard'}
              onChange={() => update('shippingMethod', 'standard')}
              className="mt-0.5 h-4 w-4 accent-amber-400"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-zinc-100">Standard</span>
                <span className="text-sm font-medium text-emerald-400">
                  FREE
                </span>
              </div>
              <p className="mt-0.5 text-sm text-zinc-400">
                3-5 business days via USPS Priority
              </p>
            </div>
          </label>
          <label
            className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-colors ${
              data.shippingMethod === 'expedited'
                ? 'border-amber-400/50 bg-amber-400/5'
                : 'border-zinc-700 bg-zinc-800/30 hover:border-zinc-600'
            }`}
          >
            <input
              type="radio"
              name="shippingMethod"
              value="expedited"
              checked={data.shippingMethod === 'expedited'}
              onChange={() => update('shippingMethod', 'expedited')}
              className="mt-0.5 h-4 w-4 accent-amber-400"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-zinc-100">Expedited</span>
                <span className="text-sm font-medium text-zinc-100">
                  ${EXPEDITED_COST.toFixed(2)}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-zinc-400">
                1-2 business days via UPS Next Day Air
              </p>
            </div>
          </label>
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          Free standard shipping on orders over ${FREE_THRESHOLD}.00
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
          type="submit"
          className="rounded-lg bg-amber-400 px-8 py-3 font-semibold text-black transition-all duration-200 hover:bg-amber-500 hover:shadow-[0_0_12px_rgba(251,191,36,0.4)]"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
