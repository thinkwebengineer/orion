import HeroBanner from "@/components/HeroBanner";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedGenetics from "@/components/FeaturedGenetics";
import BrandShowcase from "@/components/BrandShowcase";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <CategoryGrid />
      <FeaturedGenetics />
      <BrandShowcase />
    </>
  );
}
