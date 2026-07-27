import Link from 'next/link'

function MushroomIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#FFD700]">
      <ellipse cx="16" cy="10" rx="12" ry="8" fill="currentColor" />
      <rect x="13" y="10" width="6" height="12" rx="2" fill="currentColor" />
      <circle cx="11" cy="8" r="1.5" fill="#0a0a0a" opacity="0.6" />
      <circle cx="19" cy="6" r="2" fill="#0a0a0a" opacity="0.6" />
      <circle cx="22" cy="10" r="1" fill="#0a0a0a" opacity="0.6" />
      <circle cx="9" cy="12" r="1.2" fill="#0a0a0a" opacity="0.6" />
    </svg>
  )
}

export default function ComingSoonPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full bg-[#FFD700]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        <MushroomIcon />

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-white">
          <span className="text-[#FFD700]">GOLDEN</span> MYCOLOGY
        </h1>

        <p className="mt-4 text-lg text-zinc-400 leading-relaxed">
          Premium microscopy supplies and genetics for the discerning researcher.
        </p>

        <div className="mt-8 h-px w-24 bg-zinc-800" />

        <p className="mt-8 text-sm text-zinc-500">
          Our full catalog is launching soon.{' '}
          <span className="text-zinc-400">Stay curious.</span>
        </p>

        <div className="mt-12 flex gap-4">
          <Link
            href="/login"
            className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-6 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:text-white"
          >
            Admin Login
          </Link>
        </div>
      </div>

      <p className="relative z-10 mt-16 text-xs text-zinc-700">
        &copy; {new Date().getFullYear()} Golden Mycology. All rights reserved.
      </p>
    </div>
  )
}
