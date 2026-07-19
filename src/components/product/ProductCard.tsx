import Link from "next/link";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(full)}
      {half && "½"}
      {"☆".repeat(empty)}
    </span>
  );
}

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export default function ProductCard({ product }: ProductCardProps) {
  const displayPrice =
    product.variants && product.variants.length > 0
      ? product.variants[0].price
      : product.price;

  const bestVariant = product.variants?.find((v) => v.bestValue);

  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition-all duration-200 hover:border-zinc-600 hover:shadow-lg hover:shadow-zinc-900/50"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.forMicroscopyOnly && (
          <span className="rounded-md bg-amber-900/80 px-2.5 py-0.5 text-xs font-medium text-amber-200 backdrop-blur-sm">
            🔬 Microscopy Only
          </span>
        )}
        {product.featured && (
          <span className="rounded-md bg-indigo-900/80 px-2.5 py-0.5 text-xs font-medium text-indigo-200 backdrop-blur-sm">
            Featured
          </span>
        )}
      </div>

      {bestVariant && (
        <div className="absolute top-3 right-3 z-10">
          <span className="rounded-md bg-emerald-900/80 px-2.5 py-0.5 text-xs font-medium text-emerald-200 backdrop-blur-sm">
            Best Value
          </span>
        </div>
      )}

      {/* Image */}
      <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-700">
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {/* Brand */}
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Golden Mycology
        </span>

        {/* Name + Subtitle */}
        <h3 className="text-base font-semibold leading-tight text-zinc-100 group-hover:text-white">
          {product.name}
        </h3>
        {product.subtitle && (
          <p className="line-clamp-1 text-sm text-zinc-400">{product.subtitle}</p>
        )}

        {/* Rating */}
        <div className="mt-auto flex items-center gap-1.5 pt-2">
          <span className="text-sm text-amber-400">
            <StarRating rating={product.rating} />
          </span>
          <span className="text-xs text-zinc-500">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-zinc-100">
            {formatPrice(product.price)}
          </span>
          {product.variants && product.variants.length > 1 && (
            <span className="text-xs text-zinc-500">
              from {formatPrice(Math.min(...product.variants.map((v) => v.price)))}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
