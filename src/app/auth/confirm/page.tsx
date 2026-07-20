'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function AuthConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(
    'verifying',
  );
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const confirm = async () => {
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      const next = searchParams.get('next') ?? '/admin';

      if (!token_hash || !type) {
        setStatus('error');
        setErrorMessage('Missing confirmation parameters.');
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        type: type as 'signup' | 'email' | 'recovery' | 'invite',
        token_hash,
      });

      if (error) {
        setStatus('error');
        setErrorMessage(error.message);
        return;
      }

      setStatus('success');

      // Redirect after a brief delay so the user sees the success state
      setTimeout(() => {
        router.push(next);
      }, 1500);
    };

    confirm();
  }, [searchParams, supabase, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 gold-border-glow">
          {/* Verifying state */}
          {status === 'verifying' && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-zinc-600 bg-zinc-800">
                <svg
                  className="h-8 w-8 animate-spin text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-zinc-100">
                Verifying your email…
              </h1>
              <p className="mt-2 text-sm text-zinc-400">
                Please wait while we confirm your account.
              </p>
            </>
          )}

          {/* Success state */}
          {status === 'success' && (
            <>
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="gold-glow text-2xl font-bold text-[#FFD700]">
                Email Confirmed!
              </h1>
              <p className="mt-2 text-sm text-zinc-300">
                Your email has been successfully verified. Redirecting you now…
              </p>
            </>
          )}

          {/* Error state */}
          {status === 'error' && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-500 bg-zinc-900">
                <svg
                  className="h-8 w-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-red-400">
                Confirmation Failed
              </h1>
              <p className="mt-2 text-sm text-red-300">{errorMessage}</p>
              <Link
                href="/login"
                className="mt-6 inline-block rounded-lg bg-[#FFD700] px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#FFC000]"
              >
                Go to Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
