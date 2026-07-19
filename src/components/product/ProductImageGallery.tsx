"use client";

import { useState } from "react";

interface Props {
  images: string[];
  name: string;
}

export default function ProductImageGallery({ images, name }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images.length) {
    return (
      <div className="aspect-square rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-500">
        No image available
      </div>
    );
  }

  return (
    <>
      {/* Main image */}
      <button
        onClick={() => setLightboxOpen(true)}
        className="aspect-square w-full rounded-xl overflow-hidden bg-neutral-800/50 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-zoom-in"
      >
        <img
          src={images[selectedIndex]}
          alt={`${name} — image ${selectedIndex + 1}`}
          className="w-full h-full object-contain p-4"
        />
      </button>

      {/* Thumbnails — show row even for single image */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                i === selectedIndex
                  ? "border-amber-500 ring-1 ring-amber-500"
                  : "border-neutral-800 hover:border-neutral-600"
              }`}
            >
              <img
                src={src}
                alt={`${name} thumbnail ${i + 1}`}
                className="w-full h-full object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl leading-none p-2"
            aria-label="Close lightbox"
          >
            ✕
          </button>

          {/* Previous */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                );
              }}
              className="absolute left-4 text-white/70 hover:text-white text-3xl p-2"
              aria-label="Previous image"
            >
              ‹
            </button>
          )}

          <img
            src={images[selectedIndex]}
            alt={`${name} — enlarged view ${selectedIndex + 1}`}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1
                );
              }}
              className="absolute right-4 text-white/70 hover:text-white text-3xl p-2"
              aria-label="Next image"
            >
              ›
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
