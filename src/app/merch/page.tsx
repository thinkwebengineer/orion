import CategoryPage from "@/components/product/CategoryPage";
import type { SidebarSubcategory, WhyChooseItem } from "@/components/product/CategorySidebar";

const sidebarSubcategories: SidebarSubcategory[] = [
  { label: "All Merch", value: null },
  { label: "Apparel", value: "apparel" },
  { label: "Accessories", value: "stickers" },
];

const whyChooseItems: WhyChooseItem[] = [
  {
    icon: "👕",
    title: "Premium Materials",
    description: "Heavyweight fabrics and premium vinyl that last.",
  },
  {
    icon: "🎨",
    title: "Original Designs",
    description: "Exclusive Golden Mycology artwork you won't find anywhere else.",
  },
  {
    icon: "🏆",
    title: "Collector Quality",
    description: "Built to last — attention to every detail and finish.",
  },
  {
    icon: "📦",
    title: "Carefully Packed",
    description: "Every order packed with the same care as our genetics.",
  },
];

export default function MerchPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <CategoryPage
        categorySlug="merch"
        title="Merch"
        heroSubtitle="Apparel, Accessories & Culture"
        description="Apparel, stickers, and accessories to rep the culture in style."
        icon="👕"
        sidebarSubcategories={sidebarSubcategories}
        whyChooseItems={whyChooseItems}
      />
    </main>
  );
}
