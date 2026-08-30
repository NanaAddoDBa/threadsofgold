import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { BrandStorySection } from "@/components/sections/home/brand-story-section";
import { CategoryIndexSection } from "@/components/sections/home/category-index-section";
import { ClosingCtaSection } from "@/components/sections/home/closing-cta-section";
import { FeaturedCollectionSection } from "@/components/sections/home/featured-collection-section";
import { HeroSection } from "@/components/sections/home/hero-section";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <FeaturedCollectionSection />
        <CategoryIndexSection />
        <BrandStorySection />
        <ClosingCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
