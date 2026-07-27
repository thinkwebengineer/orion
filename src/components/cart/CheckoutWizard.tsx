'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import CartReview from './CartReview';
import ShippingForm, {
  type ShippingData,
  DEFAULT_SHIPPING_DATA,
} from './ShippingForm';
import PaymentForm, {
  type PaymentData,
  DEFAULT_PAYMENT_DATA,
} from './PaymentForm';
import OrderReview from './OrderReview';
import OrderConfirmation from './OrderConfirmation';
import {
  HiCheck,
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineCreditCard,
  HiOutlineDocumentText,
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2';

type Step = 1 | 2 | 3 | 4;

type OrderStatus = 'idle' | 'submitting' | 'completed' | 'error';

interface StepConfig {
  step: Step;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepConfig[] = [
  { step: 1, label: 'Cart', icon: HiOutlineShoppingBag },
  { step: 2, label: 'Shipping', icon: HiOutlineTruck },
  { step: 3, label: 'Payment', icon: HiOutlineCreditCard },
  { step: 4, label: 'Review', icon: HiOutlineDocumentText },
];

export default function CheckoutWizard() {
  const { items, clearCart, subtotal } = useCart();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set());
  const [shippingData, setShippingData] = useState<ShippingData>(
    DEFAULT_SHIPPING_DATA,
  );
  const [paymentData, setPaymentData] = useState<PaymentData>(
    DEFAULT_PAYMENT_DATA,
  );
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('idle');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderEmail, setOrderEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const EXPEDITED_COST = 12.99;

  const goToStep = (step: Step) => {
    if (completedSteps.has(step) || step === currentStep) {
      setCurrentStep(step);
    }
  };

  const completeStep = (step: Step) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(step);
      return next;
    });
  };

  // ── Step navigation ───────────────────────────────────────────────────

  const handleCartNext = () => {
    if (items.length === 0) return;
    completeStep(1);
    setCurrentStep(2);
  };

  const handleShippingNext = () => {
    completeStep(2);
    setCurrentStep(3);
  };

  const handlePaymentNext = () => {
    completeStep(3);
    setCurrentStep(4);
  };

  const handleBack = (target: Step) => {
    setCurrentStep(target);
  };

  const handleComplete = async () => {
    setOrderStatus('submitting');
    setErrorMessage(null);

    const shippingCost =
      shippingData.shippingMethod === 'expedited' ? EXPEDITED_COST : 0;
    const total = subtotal + shippingCost;

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            variant: item.variantLabel ?? null,
          })),
          shipping: {
            email: shippingData.email,
            firstName: shippingData.firstName,
            lastName: shippingData.lastName,
            streetAddress: shippingData.streetAddress,
            aptUnit: shippingData.aptUnit || undefined,
            city: shippingData.city,
            state: shippingData.state,
            zip: shippingData.zip,
            shippingMethod: shippingData.shippingMethod,
          },
          subtotal,
          shipping_cost: shippingCost,
          total,
          payment_method:
            paymentData.method === 'card'
              ? 'credit_card'
              : paymentData.method === 'crypto'
                ? 'crypto'
                : 'bank_transfer',
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(
          body.error || `Server error (${response.status})`,
        );
      }

      const result = await response.json();

      setOrderId(result.order_id);
      setOrderEmail(shippingData.email);
      completeStep(4);
      setOrderStatus('completed');
      clearCart();
    } catch (err) {
      setOrderStatus('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      );
    }
  };

  // ── Render ────────────────────────────────────────────────────────────

  // If order is completed, show confirmation instead of wizard
  if (orderStatus === 'completed' && orderId && orderEmail) {
    return (
      <div className="mx-auto max-w-2xl">
        <OrderConfirmation orderId={orderId} email={orderEmail} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress indicator */}
      <nav aria-label="Checkout progress" className="mb-10 px-2">
        <ol className="flex items-center">
          {STEPS.map((s, index) => {
            const isCompleted = completedSteps.has(s.step);
            const isCurrent = currentStep === s.step;
            const canClick = completedSteps.has(s.step);
            const Icon = s.icon;

            return (
              <li key={s.step} className="flex flex-1 items-center">
                <button
                  type="button"
                  onClick={() => canClick && goToStep(s.step)}
                  disabled={!canClick}
                  className={`flex flex-col items-center gap-1.5 ${
                    canClick ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  {/* Circle */}
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                      isCompleted
                        ? 'bg-amber-400 text-black shadow-md shadow-amber-400/30'
                        : isCurrent
                          ? 'border-2 border-amber-400 bg-zinc-900 text-amber-400 ring-2 ring-amber-400/20'
                          : 'border border-zinc-700 bg-zinc-900 text-zinc-500'
                    }`}
                  >
                    {isCompleted ? (
                      <HiCheck className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </span>

                  {/* Label */}
                  <span
                    className={`hidden text-xs font-medium transition-colors sm:block ${
                      isCurrent
                        ? 'text-amber-400'
                        : isCompleted
                          ? 'text-amber-400/70'
                          : 'text-zinc-500'
                    }`}
                  >
                    {s.label}
                  </span>
                </button>

                {/* Connector */}
                {index < STEPS.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 rounded-full transition-colors duration-300 sm:mx-4 ${
                      completedSteps.has(s.step)
                        ? 'bg-amber-400/50'
                        : 'bg-zinc-800'
                    }`}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Error banner */}
      {orderStatus === 'error' && errorMessage && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-800/50 bg-red-900/20 p-4">
          <HiOutlineExclamationTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-400">Order failed</p>
            <p className="mt-0.5 text-sm text-red-300">{errorMessage}</p>
            <p className="mt-1 text-xs text-red-400/70">
              Your cart items are still saved. Please try again.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOrderStatus('idle')}
            className="rounded-lg border border-red-800/50 px-3 py-1 text-xs text-red-400 transition-colors hover:border-red-700 hover:text-red-300"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Step content */}
      <div>
        {currentStep === 1 && <CartReview onNext={handleCartNext} />}

        {currentStep === 2 && (
          <ShippingForm
            data={shippingData}
            onChange={setShippingData}
            onBack={() => handleBack(1)}
            onNext={handleShippingNext}
          />
        )}

        {currentStep === 3 && (
          <PaymentForm
            data={paymentData}
            onChange={setPaymentData}
            onBack={() => handleBack(2)}
            onNext={handlePaymentNext}
          />
        )}

        {currentStep === 4 && (
          <OrderReview
            shipping={shippingData}
            payment={paymentData}
            onBack={() => handleBack(3)}
            onComplete={handleComplete}
          />
        )}
      </div>

      {/* Loading overlay */}
      {orderStatus === 'submitting' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-amber-400" />
            <p className="text-sm font-medium text-zinc-100">
              Placing your order…
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Please don&apos;t close this page.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
