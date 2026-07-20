import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import type { Product, CategoryInfo } from "@/types/product";
import { createAdminClient } from "@/lib/supabase/admin";

// ── Fallback detection ──────────────────────────────────────────────────
const USE_SUPABASE = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

// ── Static fallback data ────────────────────────────────────────────────
const fallbackProducts = productsData as unknown as Product[];
const fallbackCategories = categoriesData as unknown as CategoryInfo[];

// ── Row → Product mapper ────────────────────────────────────────────────
function toProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    subtitle: row.subtitle as string | undefined,
    brand: row.brand as "golden-mycology",
    category: row.category as "genetics" | "supplies" | "merch",
    subcategory: row.subcategory as string,
    price: Number(row.price),
    variants: row.variants as Product["variants"],
    rating: Number(row.rating),
    reviewCount: (row.review_count ?? row.reviewCount) as number,
    description: row.description as string,
    features: row.features as string[],
    images: row.images as string[],
    specs: row.specs as Record<string, string> | undefined,
    forMicroscopyOnly:
      (row.for_microscopy_only ?? row.forMicroscopyOnly) as
        | boolean
        | undefined,
    featured: row.featured as boolean | undefined,
    tags: row.tags as string[],
  };
}

// ── In-memory store (eagerly initialized) ───────────────────────────────
//
// Start with JSON fallback so the functions are immediately usable and
// synchronous. If Supabase is available, replace the data in the background
// once the query resolves.
let products: Product[] = [...fallbackProducts];

// Save original for fast lookups
let productMap = new Map<string, Product>(
  fallbackProducts.map((p) => [p.id, p]),
);

// ── Eager Supabase load ─────────────────────────────────────────────────
async function loadFromSupabase(): Promise<void> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name");

    if (error) throw error;
    if (!data) return;

    products = data.map(toProduct);
    productMap = new Map(products.map((p) => [p.id, p]));
  } catch {
    // JSON fallback already in place — no action needed
  }
}

// Kick off background load if Supabase is configured
if (USE_SUPABASE) {
  loadFromSupabase();
}

// ── Exported functions (sync — keep existing signatures identical) ──────

export function getAllProducts(): Product[] {
  return [...products];
}

export function getProductById(id: string): Product | undefined {
  return productMap.get(id) ?? products.find((p) => p.id === id);
}

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.category === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getProductsByBrand(brand: string): Product[] {
  return products.filter((p) => p.brand === brand);
}

// ── Categories (static config — always from JSON, not in Supabase) ──────

export function getAllCategories(): CategoryInfo[] {
  return [...fallbackCategories];
}

export function getCategoryById(id: string): CategoryInfo | undefined {
  return fallbackCategories.find((c) => c.id === id);
}
