"use client";

import type { ProductVariant } from "@/types/product";

interface Props {
  variants: ProductVariant[];
  selected: ProductVariant | null;
  onSelect: (variant: ProductVariant) => void;
}

export default function VariantSelector({ variants, selected, onSelect }: Props) {
  if (!variants.length) return null;

  return (
    <div>
      <label className="text-sm text-neutral-400 font-medium mb-2 block">
        Size / Pack
        {selected && (
          <span className="ml-2 text-amber-500 font-semibold">
            — {selected.label} (${selected.price.toFixed(2)})
          </span>
        )}
      </label>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => {
          const isSelected = selected?.label === v.label;
          return (
            <button
              key={v.label}
              onClick={() => onSelect(v)}
              className={`relative px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                isSelected
                  ? "border-amber-500 bg-amber-500/10 text-amber-400 ring-1 ring-amber-500"
                  : "border-neutral-700 bg-neutral-800/50 text-neutral-300 hover:border-neutral-500 hover:text-white"
              }`}
            >
              {v.label} — ${v.price.toFixed(2)}
              {v.bestValue && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  BEST
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
