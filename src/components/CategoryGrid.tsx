"use client";

import Link from "next/link";
import categoriesData from "@/data/categories.json";
import type { CategoryInfo } from "@/types/product";

const categories = categoriesData as unknown as CategoryInfo[];

const goldAccent = {
  border: "border-gold/30",
  glow: "shadow-gold/10",
  text: "text-gold",
  from: "from-gold/8",
  to: "to-[#B8962E]/5",
};

export default function CategoryGrid() {
  return (
    <section className="bg-[#0a0a0a] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
        {/* Section header */}
        <div className="max-w-xl">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Explore Our Collections
          </h2>
          <p className="mt-3 text-zinc-400 text-lg">
            Premium genetics, lab supplies, and merch — curated for the
            dedicated cultivator.
          </p>
        </div>

        {/* 3-column grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${cat.slug}`}
              className={`group relative overflow-hidden rounded-2xl border ${goldAccent.border} bg-gradient-to-br ${goldAccent.from} ${goldAccent.to} p-6 sm:p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${goldAccent.glow} active:scale-[0.98]`}
            >
              {/* Hover glow line */}
              <div
                className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />

              <span
                className={`block text-4xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1`}
              >
                {cat.icon}
              </span>
              <h3 className="text-lg font-semibold text-white mb-2">
                {cat.name}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {cat.description}
              </p>
              <div
                className={`mt-4 flex items-center gap-1 text-sm font-medium ${goldAccent.text} transition-all duration-300 group-hover:gap-2`}
              >
                <span>Browse {cat.name}</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
