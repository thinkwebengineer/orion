import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import type { Product, CategoryInfo } from "@/types/product";

const products = productsData as unknown as Product[];
const categories = categoriesData as unknown as CategoryInfo[];

export function getAllProducts(): Product[] {
  return [...products];
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getProductsByBrand(brand: string): Product[] {
  return products.filter((p) => p.brand === brand);
}

export function getAllCategories(): CategoryInfo[] {
  return [...categories];
}

export function getCategoryById(id: string): CategoryInfo | undefined {
  return categories.find((c) => c.id === id);
}
