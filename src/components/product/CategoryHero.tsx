"use client";

interface CategoryHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
}

export default function CategoryHero({
  title,
  subtitle,
  description,
}: CategoryHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-800/80 to-black border border-zinc-700/50 mb-10">
      {/* Background glow */}
      <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full bg-[#FFD700]/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-amber-700/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-16 px-8 py-12 md:py-16 md:px-12">
        {/* Left: Text */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#FFD700] drop-shadow-sm">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-lg md:text-xl text-zinc-300 font-medium">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="mt-4 max-w-xl text-base text-zinc-400 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Right: Decorative Samurai-Style Circle */}
        <div className="flex-shrink-0">
          <div className="relative w-36 h-36 md:w-44 md:h-44">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-2 border-[#FFD700]/30" />
            {/* Middle ring */}
            <div className="absolute inset-3 rounded-full border border-[#FFD700]/20" />
            {/* Rotated decorative accent */}
            <div
              className="absolute inset-0 rounded-full border border-[#FFD700]/10"
              style={{ transform: "rotate(45deg)" }}
            />
            {/* Center emblem */}
            <div className="absolute inset-7 rounded-full bg-gradient-to-br from-[#FFD700]/10 to-[#B8860B]/20 flex items-center justify-center border border-[#FFD700]/10">
              {/* Samurai-inspired crest SVG */}
              <svg
                viewBox="0 0 64 64"
                className="w-10 h-10 md:w-12 md:h-12 text-[#FFD700]/70"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                {/* Central diamond / gem */}
                <path d="M32 10 L42 32 L32 54 L22 32 Z" fill="currentColor" opacity="0.2" />
                {/* Crossed blades */}
                <path d="M16 16 L48 48 M48 16 L16 48" strokeLinecap="round" opacity="0.4" />
                {/* Outer ring dots */}
                <circle cx="32" cy="8" r="2" fill="currentColor" opacity="0.5" />
                <circle cx="32" cy="56" r="2" fill="currentColor" opacity="0.5" />
                <circle cx="8" cy="32" r="2" fill="currentColor" opacity="0.5" />
                <circle cx="56" cy="32" r="2" fill="currentColor" opacity="0.5" />
                {/* Inner circle */}
                <circle cx="32" cy="32" r="10" fill="none" opacity="0.3" />
                <circle cx="32" cy="32" r="4" fill="currentColor" opacity="0.3" />
              </svg>
            </div>
            {/* Corner accent lines */}
            {[0, 90, 180, 270].map((angle) => (
              <div
                key={angle}
                className="absolute w-px h-3 bg-[#FFD700]/20"
                style={{
                  left: "50%",
                  top: angle === 0 ? "6px" : angle === 180 ? "auto" : "50%",
                  bottom: angle === 180 ? "6px" : "auto",
                  transform: `translateX(-50%) rotate(${angle}deg)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
