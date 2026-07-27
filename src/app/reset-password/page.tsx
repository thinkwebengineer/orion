'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Let Supabase Auth process the recovery token from the URL hash
  // Supabase stores the session after processing the hash fragment
  useEffect(() => {
    const init = async () => {
      const hash = window.location.hash;
      if (!hash) {
        setError('Invalid or expired reset link. Please request a new one.');
        return;
      }

      // Parse the hash for the access_token
      const params = new URLSearchParams(hash.replace('#', ''));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (!accessToken) {
        setError('Invalid or expired reset link. Please request a new one.');
        return;
      }

      // Explicitly set the session from the recovery token
      // This tells Supabase this is a valid recovery flow
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || '',
      });

      if (sessionError) {
        console.error('setSession error:', sessionError);
        setError('Invalid or expired reset link. Please request a new one.');
        return;
      }

      // Clear the hash from the URL so refreshing doesn't re-process it
      window.history.replaceState(null, '', '/reset-password');

      setIsReady(true);
    };

    init();
  }, [supabase]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setIsSubmitting(false);
      return;
    }

    // Redirect to login on success
    router.push('/login');
  };

  // Loading / waiting for token
  if (!isReady && !error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 gold-border-glow">
            <p className="text-sm text-zinc-400">Verifying reset link…</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state (invalid token)
  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 gold-border-glow">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-500 bg-zinc-900">
              <svg
                className="h-8 w-8 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h1 className="mb-2 text-2xl font-bold text-red-400">Invalid Link</h1>
            <p className="mb-6 text-sm text-zinc-400">{error}</p>

            <Link
              href="/forgot-password"
              className="inline-block rounded-lg bg-[#FFD700] px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#FFC000]"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="gold-glow text-3xl font-bold tracking-tight text-[#FFD700]">
            Set New Password
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Choose a new password for your account
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 gold-border-glow">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-zinc-300"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="At least 6 characters"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-zinc-300"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repeat your new password"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]"
              />
            </div>

            {password && confirmPassword && password !== confirmPassword && (
              <div className="rounded-lg border border-red-900/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
                Passwords do not match
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-900/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#FFD700] px-4 py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#FFC000] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Resetting password…' : 'Reset Password'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-zinc-800" />
            <span className="text-xs text-zinc-500">OR</span>
            <div className="flex-1 border-t border-zinc-800" />
          </div>

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
