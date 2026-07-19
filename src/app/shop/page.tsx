import CategoryPage from "@/components/product/CategoryPage";

export default function ShopPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <CategoryPage
        title="Shop All"
        heroSubtitle="The Complete Golden Mycology Collection"
        description="Browse our full catalog of genetics, supplies, and merch."
      />
    </main>
  );
}
