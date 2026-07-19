"use client";

import Link from "next/link";
import { getFeaturedProducts } from "@/lib/products";
import type { Product } from "@/types/product";

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span
      className="inline-flex items-center gap-0.5 text-sm"
      aria-label={`${rating} out of 5 stars`}
    >
      <span className="text-gold">{"★".repeat(full)}</span>
      {half && <span className="text-gold">★</span>}
      <span className="text-zinc-600">{"★".repeat(empty)}</span>
    </span>
  );
}

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export default function FeaturedGenetics() {
  const products = getFeaturedProducts().filter(
    (p) => p.category === "genetics"
  );

  if (products.length === 0) return null;

  return (
    <section className="bg-[#0a0a0a] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
        {/* Section header */}
        <div className="flex items-end justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Featured Genetics
            </h2>
            <p className="mt-3 text-zinc-400 text-lg">
              Our most sought-after isolates and cultures, curated for the
              serious collector.
            </p>
          </div>
          <Link
            href="/genetics"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-gold hover:text-[#F0D060] transition-colors"
          >
            View All Genetics
            <span className="text-lg leading-none">→</span>
          </Link>
        </div>

        {/* Grid layout */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product: Product) => (
            <div
              key={product.id}
              className="group flex flex-col rounded-xl border border-gold/10 bg-zinc-900/50 overflow-hidden transition-all duration-200 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5"
            >
              {/* Image area */}
              <Link href={`/product/${product.id}`}>
                <div className="aspect-[4/3] bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center overflow-hidden">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-4xl opacity-20">🧬</span>
                  )}
                </div>
              </Link>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-1.5 p-4">
                <Link href={`/product/${product.id}`}>
                  <h3 className="text-base font-semibold leading-tight text-zinc-100 group-hover:text-white mt-1">
                    {product.name}
                  </h3>
                </Link>

                {product.subtitle && (
                  <p className="line-clamp-1 text-sm text-zinc-400">
                    {product.subtitle}
                  </p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-1.5 pt-1">
                  <StarRating rating={product.rating} />
                  <span className="text-xs text-zinc-500">
                    ({product.reviewCount})
                  </span>
                </div>

                {/* Price */}
                <span className="text-lg font-bold text-gold">
                  {formatPrice(product.price)}
                  {product.variants && product.variants.length > 1 && (
                    <span className="text-xs text-zinc-500 font-normal ml-1">
                      from{" "}
                      {formatPrice(
                        Math.min(...product.variants.map((v) => v.price))
                      )}
                    </span>
                  )}
                </span>

                {/* Add to Cart button */}
                <button className="mt-3 w-full rounded-lg bg-gold py-2.5 text-sm font-semibold text-black transition-all hover:brightness-110 active:scale-[0.97]">
                  Add to Cart
                </button>

                {/* Microscopy badge */}
                {product.forMicroscopyOnly && (
                  <span className="text-[10px] text-gold/60 font-medium text-center">
                    🔬 For microscopy use only
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/genetics"
            className="inline-flex items-center gap-2 rounded-lg border border-gold/30 px-6 py-3 text-sm font-medium text-gold hover:border-gold/60 transition-colors"
          >
            View All Genetics
            <span className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
