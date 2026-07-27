'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch {
      // Don't reveal errors — always show "Check your email" for security
    }

    setSent(true);
    setIsSubmitting(false);
  };

  // Success state
  if (sent) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 gold-border-glow">
            {/* Mail icon */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#FFD700] bg-zinc-900">
              <svg
                className="h-8 w-8 text-[#FFD700]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h1 className="gold-glow mb-2 text-2xl font-bold text-[#FFD700]">
              Check Your Email
            </h1>
            <p className="mb-2 text-sm text-zinc-300">
              We&apos;ve sent a password reset link to{' '}
              <span className="font-medium text-zinc-100">{email}</span>
            </p>
            <p className="mb-6 text-xs text-zinc-500">
              Click the link in the email to reset your password. It expires in
              one hour.
            </p>

            <Link
              href="/login"
              className="inline-block rounded-lg bg-[#FFD700] px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#FFC000]"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="gold-glow text-3xl font-bold tracking-tight text-[#FFD700]">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 gold-border-glow">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-zinc-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#FFD700] px-4 py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#FFC000] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Sending link…' : 'Send Reset Link'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-zinc-800" />
            <span className="text-xs text-zinc-500">OR</span>
            <div className="flex-1 border-t border-zinc-800" />
          </div>

          {/* Back to login */}
          <p className="text-center text-sm text-zinc-400">
            Remember your password?{' '}
            <Link
              href="/login"
              className="font-medium text-[#FFD700] transition-colors hover:text-[#FFC000]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
