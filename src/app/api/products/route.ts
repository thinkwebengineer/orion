import { NextRequest } from "next/server";
import {
  getAllProducts,
  getProductsByCategory,
} from "@/lib/products";
import type { Product } from "@/types/product";

/**
 * GET /api/products
 *
 * Query params:
 *   ?category=genetics      — filter by category slug
 *   &brand=golden-mycology  — filter by brand
 *   &featured=true          — only featured products
 *   &search=golden          — search in name, description, tags
 *
 * Returns: { products: Product[] }
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const featured = searchParams.get("featured");
  const search = searchParams.get("search");

  // Start with category filter (or all)
  let result: Product[] = category
    ? getProductsByCategory(category)
    : getAllProducts();

  // Apply brand filter
  if (brand) {
    result = result.filter((p) => p.brand === brand);
  }

  // Apply featured filter
  if (featured === "true") {
    result = result.filter((p) => p.featured);
  }

  // Apply search filter (name, description, tags)
  if (search) {
    const lower = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower) ||
        p.tags.some((t) => t.toLowerCase().includes(lower)),
    );
  }

  return Response.json({ products: result }, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
