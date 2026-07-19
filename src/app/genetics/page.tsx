import CategoryPage from "@/components/product/CategoryPage";
import type { SidebarSubcategory, WhyChooseItem } from "@/components/product/CategorySidebar";

const sidebarSubcategories: SidebarSubcategory[] = [
  { label: "All Genetics", value: null },
  { label: "Liquid Cultures", value: "liquid-cultures" },
  { label: "Spore Swabs", value: "spore-swabs" },
];

const whyChooseItems: WhyChooseItem[] = [
  {
    icon: "🧬",
    title: "Premium Isolates",
    description: "Sourced from elite mother cultures with documented lineage.",
  },
  {
    icon: "🧪",
    title: "Lab-Tested Viability",
    description: "Every culture verified under microscope before shipping.",
  },
  {
    icon: "🧫",
    title: "Sterile Technique",
    description: "Prepared in ISO 5 flow hood with pharmaceutical-grade materials.",
  },
  {
    icon: "🔬",
    title: "Research Grade",
    description: "For microscopy and preservation purposes only.",
  },
];

export default function GeneticsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <CategoryPage
        categorySlug="genetics"
        title="Genetics"
        heroSubtitle="Premium Genetic Isolates & Cultures"
        description="Premium liquid cultures, spore swabs, and genetic isolates for the serious collector and cultivator."
        icon="🧬"
        sidebarSubcategories={sidebarSubcategories}
        whyChooseItems={whyChooseItems}
      />
    </main>
  );
}
