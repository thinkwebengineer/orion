import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Golden Mycology | Premium Mycology Genetics & Supplies",
  description:
    "Golden Mycology brings you precision-bred liquid cultures, spore swabs, agar plates, and supplies for the serious cultivator. Made fresh in the Pacific Northwest.",
};

const values = [
  {
    emoji: "🧬",
    title: "Genetic Integrity",
    description:
      "Every culture and isolate is verified under ISO 5 laminar flow before it reaches your lab. No shortcuts, no guesswork.",
  },
  {
    emoji: "⚙️",
    title: "No-Nonsense Gear",
    description:
      "Agar plates, grain bags, and AIO substrates that actually work. Tested, documented, and ready for the modern cultivator.",
  },
  {
    emoji: "🤝",
    title: "Community First",
    description:
      "We don't gatekeep. Protocols are shared, questions are answered, and the whole ecosystem moves forward together.",
  },
  {
    emoji: "🌿",
    title: "Sustainability",
    description:
      "From compostable packaging to low-waste lab practices — cultivation shouldn't cost the earth.",
  },
];

export default function AboutPage() {
  return (
    <main className="flex-1 font-sans">
      {/* Hero section */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          {/* Left column — brand story */}
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              About
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
              Golden Mycology
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Golden Mycology was born from a simple idea: precision-bred liquid
              cultures and lab-tested supplies shouldn&apos;t be hard to find.
              Every product we sell is prepared under ISO 5 laminar flow,
              verified for viability, and shipped with care from our lab in the
              Pacific Northwest.
            </p>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              What started as a passion project between two obsessed cultivators
              turned into a full-spectrum mycology supply chain. Today we ship
              across the US with the same ethos: clean gear, viable cultures,
              and zero pretension.
            </p>
          </div>

          {/* Right column — brand card */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-50/50 p-6 dark:bg-amber-950/20">
              <div className="mb-2 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-lg font-bold text-white">
                  GM
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    Golden Mycology
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Master Crafted Genetics Since 2024
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Precision-bred liquid cultures and spore isolates from the Pacific
                Northwest. Every syringe is prepared under ISO 5 laminar flow,
                lab-tested for viability, and packaged with the care that only a true
                mycophile understands.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-amber-50/50 p-6 dark:bg-amber-950/20">
              <div className="mb-2 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-lg font-bold text-white">
                  🧫
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    Premium Supplies
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Lab Tested &amp; Ready to Use
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Agar plates, grain bags, and AIO substrate systems designed for the
                modern cultivator. No gatekeeping, no pretension — just clean gear
                that works, backed by real lab protocols.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values grid */}
      <section className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-24">
          <h2 className="text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            What We Stand For
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-zinc-600 dark:text-zinc-400">
            Four principles that guide every culture we sell and every plate we pack.
          </p>
          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
              >
                <span className="text-3xl">{v.emoji}</span>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
