'use client';

import Link from 'next/link';

export default function ComingSoonPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-gray-100 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-amber-400 mb-6">
          Golden Mycology
        </h1>
        <p className="text-xl mb-8">
          Coming Soon
        </p>
        <div className="space-y-4">
          <p className="text-lg">
            We're cultivating something special. Please check back soon.
          </p>
          <p className="text-sm text-amber-300">
            Expected launch: Soon
          </p>
        </div>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-black font-medium rounded-lg transition-colors"
        >
          Notify Me When Live
        </Link>
      </div>
    </div>
  );
}