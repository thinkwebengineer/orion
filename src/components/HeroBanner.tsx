"use client";

import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";

export default function HeroBanner() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#0a0a0a]">
      {/* Subtle gold radial gradient backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(255,215,0,0.08)_0%,transparent_60%)]" />

      {/* Samurai silhouette — large gold circle with subtle pattern */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[min(70vw,600px)] aspect-square pointer-events-none select-none">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/15 to-transparent blur-[60px]" />
        <div className="absolute inset-[15%] rounded-full border border-gold/10">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_40%_35%,rgba(255,215,0,0.12)_0%,transparent_50%)]" />
          {/* Samurai helmet / kabuto suggestion via concentric arcs */}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full opacity-[0.12]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Kabuto (helmet) dome */}
            <ellipse cx="100" cy="85" rx="55" ry="45" stroke="#FFD700" strokeWidth="1.5" />
            {/* Maedate (crest) */}
            <path d="M100 40 L100 15 M100 20 L85 30 M100 20 L115 30" stroke="#FFD700" strokeWidth="1.5" />
            {/* Shikoro (neck guard) layers */}
            <path d="M45 85 Q50 120 100 130 Q150 120 155 85" stroke="#FFD700" strokeWidth="1" opacity="0.6" />
            <path d="M50 100 Q55 130 100 140 Q145 130 150 100" stroke="#FFD700" strokeWidth="1" opacity="0.4" />
            {/* Menpo (face guard) hint */}
            <path d="M75 95 Q100 110 125 95" stroke="#FFD700" strokeWidth="0.8" opacity="0.3" />
            {/* Katana vertical */}
            <line x1="165" y1="50" x2="165" y2="180" stroke="#FFD700" strokeWidth="1" opacity="0.4" />
            <line x1="160" y1="50" x2="170" y2="50" stroke="#FFD700" strokeWidth="1" opacity="0.4" />
          </svg>
        </div>
        {/* Gold ring accents */}
        <div className="absolute inset-[8%] rounded-full border border-gold/5" />
      </div>

      {/* Bottom gold glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12 lg:px-16 w-full">
        <div className="max-w-3xl">
          {/* Premium badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 text-sm text-gold mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            Premium Mycology Supplies
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white leading-[0.92]">
            <span className="block">Golden</span>
            <span className="block mt-1">
              <span className="bg-gradient-to-r from-gold via-[#F0D060] to-gold bg-clip-text text-transparent">
                Mycology
              </span>
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-xl leading-relaxed">
            Premium liquid cultures, spore swabs, and lab-grade supplies —
            prepared fresh in sterile conditions for the dedicated cultivator
            and serious collector.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-4 text-sm font-semibold text-black transition-all hover:brightness-110 active:scale-[0.97] shadow-lg shadow-gold/20"
            >
              Shop Now
              <HiArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/genetics"
              className="inline-flex items-center gap-2 rounded-xl border border-gold/40 px-8 py-4 text-sm font-semibold text-gold transition-all hover:bg-gold/10 active:scale-[0.97]"
            >
              Explore Genetics
              <HiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
