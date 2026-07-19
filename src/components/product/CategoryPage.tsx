"use client";

import { useMemo, useState } from "react";
import type { Product, CategoryInfo } from "@/types/product";
import {
  getAllProducts,
  getProductsByCategory,
  getCategoryById,
} from "@/lib/products";
import ProductGrid from "./ProductGrid";
import { sortProducts, type SortOption } from "./CategoryFilter";
import CategoryHero from "./CategoryHero";
import CategorySidebar from "./CategorySidebar";
import type { SidebarSubcategory, WhyChooseItem } from "./CategorySidebar";

interface CategoryPageProps {
  categorySlug?: string; // omit or "all" for /shop
  title?: string;
  description?: string;
  /** Optional subtitle shown below the hero title (e.g. "Premium Genetic Isolates") */
  heroSubtitle?: string;
  icon?: string;
  /** Explicit subcategory list for the sidebar. Auto-extracted from products if omitted. */
  sidebarSubcategories?: SidebarSubcategory[];
  /** "Why Choose" benefit items for the sidebar. Sensible defaults provided. */
  whyChooseItems?: WhyChooseItem[];
}

export default function CategoryPage({
  categorySlug,
  title: explicitTitle,
  description: explicitDescription,
  heroSubtitle,
  icon: explicitIcon,
  sidebarSubcategories: explicitSubcategories,
  whyChooseItems: explicitWhyChoose,
}: CategoryPageProps) {
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(
    null
  );
  const [sort, setSort] = useState<SortOption>("default");

  const categoryInfo =
    categorySlug && categorySlug !== "all"
      ? getCategoryById(categorySlug)
      : null;

  const title = explicitTitle ?? categoryInfo?.name ?? "Shop All";
  const description =
    explicitDescription ??
    categoryInfo?.description ??
    "Browse our full catalog.";
  const icon = explicitIcon ?? categoryInfo?.icon ?? null;

  const rawProducts = useMemo(() => {
    return categorySlug && categorySlug !== "all"
      ? getProductsByCategory(categorySlug)
      : getAllProducts();
  }, [categorySlug]);

  // Auto-extract subcategories from product data if not provided explicitly
  const autoSubcategories = useMemo(() => {
    const seen = new Set<string>();
    for (const p of rawProducts) {
      if (!seen.has(p.subcategory)) {
        seen.add(p.subcategory);
      }
    }
    const values = Array.from(seen).sort();
    return [
      { label: `All ${title}`, value: null as string | null },
      ...values.map((v) => ({
        label: v
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
        value: v,
      })),
    ];
  }, [rawProducts, title]);

  const sidebarSubcategories = explicitSubcategories ?? autoSubcategories;

  // Default "Why Choose" items — refined, category-agnostic
  const whyChooseItems: WhyChooseItem[] = explicitWhyChoose ?? [
    {
      icon: "🧪",
      title: "Lab-Tested Quality",
      description: "Every product verified for purity and consistency.",
    },
    {
      icon: "🧫",
      title: "Sterile Technique",
      description: "ISO 5 flow hood environment for all preparations.",
    },
    {
      icon: "🔬",
      title: "Research Grade",
      description: "Premium materials for serious collectors.",
    },
    {
      icon: "🚚",
      title: "Fast & Discreet",
      description: "Secure shipping in protective packaging.",
    },
  ];

  const filtered = useMemo(() => {
    let result = rawProducts;
    if (activeSubcategory) {
      result = result.filter((p) => p.subcategory === activeSubcategory);
    }
    return sortProducts(result, sort);
  }, [rawProducts, activeSubcategory, sort]);

  return (
    <div className="flex-1">
      {/* Hero */}
      <CategoryHero
        title={title}
        subtitle={heroSubtitle}
        description={description}
      />

      {/* Sidebar + Grid layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left sidebar */}
        <CategorySidebar
          categoryName={title}
          subcategories={sidebarSubcategories}
          activeSubcategory={activeSubcategory}
          onSubcategoryChange={setActiveSubcategory}
          whyChooseItems={whyChooseItems}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-zinc-500">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 outline-none transition-colors focus:border-zinc-600"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>

          {/* Product Grid */}
          <ProductGrid
            products={filtered}
            emptyMessage={
              activeSubcategory
                ? `No ${title.toLowerCase()} found in this category.`
                : `No ${title.toLowerCase()} available yet.`
            }
          />
        </div>
      </div>
    </div>
  );
}
