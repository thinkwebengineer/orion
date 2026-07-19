"use client";

const benefits = [
  {
    icon: "🧫",
    title: "Made Fresh",
    description:
      "Cultures and plates are prepared fresh to order. No pre-made stock sitting on shelves — every order gets our full attention.",
  },
  {
    icon: "🌬️",
    title: "Sterile & Clean",
    description:
      "All products are prepared in ISO 5 laminar flow environments using pharmaceutical-grade sterile technique. Clean results start here.",
  },
  {
    icon: "✅",
    title: "Lab Tested",
    description:
      "Every batch is tested for viability and purity before it ships. We don't ship anything we wouldn't use in our own lab.",
  },
  {
    icon: "📦",
    title: "Secure Packaging",
    description:
      "Discreet, temperature-protected shipping with tracking on every order. Your genetics arrive viable and your privacy is protected.",
  },
];

export default function BrandShowcase() {
  return (
    <section className="bg-[#0a0a0a] py-24 sm:py-32 relative overflow-hidden">
      {/* Subtle gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gold/[0.02] blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Why Choose Golden Mycology?
          </h2>
          <p className="mt-3 text-zinc-400 text-lg">
            Every product reflects our commitment to quality, cleanliness, and
            the craft of mycology.
          </p>
          {/* Gold divider */}
          <div className="mt-6 mx-auto w-16 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        {/* 4 benefit cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group relative rounded-2xl border border-gold/10 bg-gradient-to-br from-zinc-900/80 to-gold/[0.02] p-6 sm:p-8 transition-all duration-300 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5"
            >
              {/* Top gold accent line on hover */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <span className="block text-3xl mb-4">{benefit.icon}</span>
              <h3 className="text-lg font-semibold text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
