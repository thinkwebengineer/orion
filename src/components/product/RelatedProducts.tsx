import type { Product } from "@/types/product";
import { getAllProducts } from "@/lib/products";
import Link from "next/link";

interface Props {
  product: Product;
}

export default function RelatedProducts({ product }: Props) {
  const related = getAllProducts()
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category || p.brand === product.brand)
    )
    .slice(0, 4);

  if (!related.length) return null;

  return (
    <div className="mt-16 pt-10 border-t border-neutral-800">
      <h2 className="text-xl font-bold text-white mb-6">You Might Also Like</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {related.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.id}`}
            className="group rounded-xl bg-neutral-800/30 border border-neutral-800 hover:border-neutral-700 p-3 transition-all"
          >
            <div className="aspect-square rounded-lg overflow-hidden bg-neutral-800/50 mb-3 flex items-center justify-center p-2">
              <img
                src={p.images[0] ?? ""}
                alt={p.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-0.5">
              {p.subcategory}
            </p>
            <p className="text-sm font-medium text-neutral-200 group-hover:text-amber-400 transition-colors line-clamp-2">
              {p.name}
            </p>
            <p className="text-sm font-semibold text-amber-400 mt-1">
              ${p.price.toFixed(2)}
            </p>
            {p.forMicroscopyOnly && (
              <p className="text-[10px] text-amber-500/60 mt-0.5">🔬 Microscopy Use</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
