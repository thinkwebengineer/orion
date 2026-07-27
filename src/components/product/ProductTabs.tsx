"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import siteContent from "@/data/site-content.json";
import Reviews from "@/components/product/Reviews";

interface Props {
  product: Product;
}

type TabId = "description" | "specs" | "shipping" | "faq" | "reviews";

const TABS: { id: TabId; label: string }[] = [
  { id: "description", label: "Description" },
  { id: "specs", label: "Specifications" },
  { id: "shipping", label: "Shipping" },
  { id: "faq", label: "FAQ" },
  { id: "reviews", label: "Reviews" },
];

const shipping = siteContent.shipping;

const FAQ_ITEMS = [
  {
    q: "Are these products for cultivation?",
    a: "Our genetics and supplies are sold for microscopy, taxonomy, and preservation purposes only. All genetic products are labeled 'For Microscopy Use Only' and should not be used for illegal activities.",
  },
  {
    q: "How are items packaged for shipping?",
    a: "All orders ship in discreet, plain packaging with no branding or identifying marks. Liquid cultures and temperature-sensitive items include insulation and ice packs when needed.",
  },
  {
    q: "What is the shelf life?",
    a: "Liquid cultures last 6 months refrigerated. Spore swabs last 12 months in cool, dark storage. Grain bags and AIO bags last 3 months at room temperature. Agar plates last 6 months refrigerated upside down.",
  },
  {
    q: "Do you ship internationally?",
    a: "Currently we ship within the United States only. International shipping is coming soon — join our Discord for updates.",
  },
  {
    q: "Can I return or exchange?",
    a: "Due to the biological nature of our products, all sales are final. If your order arrives damaged or contaminated, contact us within 48 hours and we'll make it right.",
  },
];

export default function ProductTabs({ product }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("description");

  return (
    <div className="mt-12">
      {/* Tab bar */}
      <div className="flex border-b border-neutral-800 gap-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-amber-400"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {tab.id === "reviews"
              ? `Reviews (${product.reviewCount})`
              : tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
            )}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="py-6">
        {activeTab === "description" && (
          <div className="space-y-4">
            <p className="text-neutral-300 leading-relaxed">{product.description}</p>
            {product.features.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Features
                </h4>
                <ul className="space-y-1.5">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-neutral-300 text-sm">
                      <span className="text-amber-500 mt-0.5">●</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === "specs" && product.specs && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="flex gap-2 text-sm">
                <span className="text-neutral-500 capitalize min-w-24">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <span className="text-neutral-200">{value}</span>
              </div>
            ))}
            {product.forMicroscopyOnly && (
              <div className="col-span-full flex gap-2 text-sm text-amber-400 bg-amber-500/10 rounded-lg px-3 py-2">
                <span className="font-medium">⚠ Legal Status:</span>
                <span>For microscopy and preservation use only</span>
              </div>
            )}
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-neutral-800/40 border border-neutral-800">
              <span className="text-neutral-500 mt-0.5">📬</span>
              <div>
                <p className="font-medium text-neutral-200">Standard Shipping</p>
                <p className="text-neutral-400 mt-0.5">{shipping.standard}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-neutral-800/40 border border-neutral-800">
              <span className="text-neutral-500 mt-0.5">🚀</span>
              <div>
                <p className="font-medium text-neutral-200">Expedited Shipping</p>
                <p className="text-neutral-400 mt-0.5">{shipping.expedited}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-900/20 border border-green-800/40">
              <span className="text-green-400 mt-0.5">🎉</span>
              <div>
                <p className="font-medium text-green-300">Free Shipping</p>
                <p className="text-green-400/70 mt-0.5">
                  Orders over ${shipping.freeThreshold} ship free via standard shipping.
                </p>
              </div>
            </div>
            <p className="text-neutral-500 text-xs italic mt-2">
              All orders ship discreetly in plain packaging. Tracking provided via email.
            </p>
          </div>
        )}

        {activeTab === "faq" && (
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <details key={i} className="group">
                <summary className="flex items-center justify-between cursor-pointer text-neutral-200 font-medium text-sm py-2 border-b border-neutral-800 group-open:border-amber-500/30">
                  {item.q}
                  <span className="text-neutral-500 group-open:text-amber-400 transition-colors text-lg leading-none">
                    +
                  </span>
                </summary>
                <p className="text-neutral-400 text-sm mt-2 pb-3 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <Reviews productId={product.id} />
        )}
      </div>
    </div>
  );
}
