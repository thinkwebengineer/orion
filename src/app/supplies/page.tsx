import CategoryPage from "@/components/product/CategoryPage";
import type { SidebarSubcategory, WhyChooseItem } from "@/components/product/CategorySidebar";

const sidebarSubcategories: SidebarSubcategory[] = [
  { label: "All Supplies", value: null },
  { label: "Agar Media", value: "agar-media" },
  { label: "Substrates", value: "substrates" },
];

const whyChooseItems: WhyChooseItem[] = [
  {
    icon: "🧪",
    title: "Lab-Grade Quality",
    description: "Professional-grade materials used by serious cultivators.",
  },
  {
    icon: "🧫",
    title: "Pre-Sterilized",
    description: "Ready to use — no prep, no hassle, no contamination worries.",
  },
  {
    icon: "📋",
    title: "Consistent Results",
    description: "Standardized production process for repeatable outcomes.",
  },
  {
    icon: "🚚",
    title: "Fast Shipping",
    description: "Carefully packed and shipped to arrive fresh.",
  },
];

export default function SuppliesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <CategoryPage
        categorySlug="supplies"
        title="Supplies"
        heroSubtitle="Lab-Grade Agar Plates, Substrates & Tools"
        description="Lab-grade agar plates, grain bags, AIO substrate bags, and all the essentials for clean mycology."
        icon="🔬"
        sidebarSubcategories={sidebarSubcategories}
        whyChooseItems={whyChooseItems}
      />
    </main>
  );
}
