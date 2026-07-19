"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

interface Props {
  product: Product;
  selectedVariant: string | undefined;
  quantity: number;
  price: number;
}

export default function AddToCartButton({
  product,
  selectedVariant,
  quantity,
  price,
}: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const handleAddToCart = () => {
    if (quantity <= 0) return;
    addItem({
      productId: product.id,
      name: product.name,
      price,
      quantity,
      variantLabel: selectedVariant,
      image: product.images[0] ?? "",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = () => {
    setWishlisted((prev) => !prev);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleAddToCart}
        className={`flex-1 py-3 px-6 rounded-lg font-semibold text-sm transition-all ${
          added
            ? "bg-green-600 text-white"
            : "bg-amber-500 text-black hover:bg-amber-400 active:scale-[0.98]"
        }`}
      >
        {added ? "✓ Added to Cart" : "Add to Cart"}
      </button>

      <button
        onClick={handleWishlist}
        className={`w-12 h-12 flex items-center justify-center rounded-lg border transition-all ${
          wishlisted
            ? "border-red-500/50 bg-red-500/10 text-red-400"
            : "border-neutral-700 bg-neutral-800/50 text-neutral-400 hover:border-neutral-500 hover:text-white"
        }`}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={wishlisted ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={2}
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </button>
    </div>
  );
}
