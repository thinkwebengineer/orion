export interface ProductVariant {
  label: string;
  price: number;
  bestValue?: boolean;
}

export type Brand = "golden-mycology";

export type Category = "genetics" | "supplies" | "merch";

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  brand: Brand;
  category: Category;
  subcategory: string;
  price: number;
  variants?: ProductVariant[];
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  images: string[];
  specs?: Record<string, string>;
  forMicroscopyOnly?: boolean;
  featured?: boolean;
  tags: string[];
}

export interface CategoryInfo {
  id: Category;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
  };
  guarantees: {
    icon: string;
    title: string;
    description: string;
  }[];
  shipping: {
    standard: string;
    expedited: string;
    freeThreshold: number;
  };
  seo: {
    title: string;
    description: string;
  };
}
