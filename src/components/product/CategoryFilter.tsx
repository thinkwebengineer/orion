"use client";

import type { Product } from "@/types/product";

type SortOption = "default" | "price-asc" | "price-desc" | "rating" | "name";

interface CategoryFilterProps {
  subcategories: string[];
  activeSubcategory: string | null;
  onSubcategoryChange: (sub: string | null) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  productCount: number;
}

const SORT_LABELS: Record<SortOption, string> = {
  default: "Default",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  rating: "Highest Rated",
  name: "Name A–Z",
};

export type { SortOption };

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }
  return sorted;
}

function formatSubcategoryLabel(sub: string): string {
  return sub
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function CategoryFilter({
  subcategories,
  activeSubcategory,
  onSubcategoryChange,
  sort,
  onSortChange,
  productCount,
}: CategoryFilterProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Subcategory pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onSubcategoryChange(null)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            activeSubcategory === null
              ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
              : "bg-zinc-100/50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          All
        </button>
        {subcategories.map((sub) => (
          <button
            key={sub}
            onClick={() => onSubcategoryChange(sub)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeSubcategory === sub
                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                : "bg-zinc-100/50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {formatSubcategoryLabel(sub)}
          </button>
        ))}
      </div>

      {/* Sort + count */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-zinc-500">{productCount} product{productCount !== 1 ? "s" : ""}</span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 outline-none transition-colors focus:border-zinc-600"
        >
          {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
