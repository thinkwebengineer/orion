"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product, ProductVariant } from "@/types/product";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import VariantSelector from "@/components/product/VariantSelector";
import QuantitySelector from "@/components/product/QuantitySelector";
import AddToCartButton from "@/components/product/AddToCartButton";
import ProductTabs from "@/components/product/ProductTabs";
import MicroscopyDisclaimer from "@/components/product/MicroscopyDisclaimer";
import RelatedProducts from "@/components/product/RelatedProducts";

interface Props {
  product: Product;
}

export default function ProductDetailClient({ product }: Props) {
  const hasVariants = product.variants && product.variants.length > 0;
  const defaultVariant = hasVariants ? product.variants![0] : null;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    defaultVariant
  );
  const [quantity, setQuantity] = useState(1);

  const currentPrice = selectedVariant?.price ?? product.price;
  const currentVariantLabel = selectedVariant?.label;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
        <Link href="/" className="hover:text-neutral-300 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/${product.category}`}
          className="hover:text-neutral-300 transition-colors capitalize"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-neutral-400 truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Disclaimer banner */}
      <MicroscopyDisclaimer visible={!!product.forMicroscopyOnly} />

      {/* Product layout: image + details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Image gallery */}
        <ProductImageGallery images={product.images} name={product.name} />

        {/* Right: Product info */}
        <div className="flex flex-col gap-6">
          {/* Brand + Category */}
          <div className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-wider">
            <span>{product.brand.replace("-", " ")}</span>
            <span className="text-neutral-700">•</span>
            <span>{product.subcategory}</span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {product.name}
            </h1>
            {product.subtitle && (
              <p className="text-neutral-400 mt-1">{product.subtitle}</p>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400 text-sm">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i}>
                  {i < Math.round(product.rating) ? "★" : "☆"}
                </span>
              ))}
            </div>
            <span className="text-sm text-neutral-500">
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-amber-400">
              ${currentPrice.toFixed(2)}
            </span>
            {selectedVariant?.bestValue && (
              <span className="text-xs bg-green-600/20 text-green-400 px-2 py-0.5 rounded-full font-medium">
                Best Value
              </span>
            )}
          </div>

          {/* Divider */}
          <hr className="border-neutral-800" />

          {/* Variant selector */}
          <VariantSelector
            variants={product.variants ?? []}
            selected={selectedVariant}
            onSelect={(v) => {
              setSelectedVariant(v);
              setQuantity(1);
            }}
          />

          {/* Quantity + Add to Cart */}
          <div className="space-y-4">
            <QuantitySelector quantity={quantity} onChange={setQuantity} />
            <AddToCartButton
              product={product}
              selectedVariant={currentVariantLabel}
              quantity={quantity}
              price={currentPrice}
            />
          </div>

          {/* Micro-trust signals */}
          <div className="flex flex-wrap gap-4 text-xs text-neutral-500 pt-2">
            <span className="flex items-center gap-1">🔬 Lab Tested</span>
            <span className="flex items-center gap-1">📦 Discreet Shipping</span>
            <span className="flex items-center gap-1">🔄 Satisfaction Guaranteed</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ProductTabs product={product} />

      {/* Related Products */}
      <RelatedProducts product={product} />
    </div>
  );
}
