import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/types";

import HomeCategoryCards from "@/components/ui/home/HomeCategoryCards";
import HomeContactUs from "@/components/ui/home/HomeContactUs";
import HomeDiscountedProducts from "@/components/ui/home/HomeDiscountedProducts";
import HomeHero from "@/components/ui/home/HomeHero";
import HomeReviewerFeedback from "@/components/ui/home/HomeReviewerFeedback";
import { getProducts } from "@/services/productsService";

type FeaturedState = {
  allItems: Product[];
  items: Product[];
  loading: boolean;
  error: string | null;
};

const heroHotspot = {
  productId: "25",
  x: "72%",
  y: "36%",
} as const;

function Home(): JSX.Element {
  const [featuredState, setFeaturedState] = useState<FeaturedState>({
    allItems: [],
    items: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadFeaturedProducts(): Promise<void> {
      try {
        const response = await getProducts();

        if (!isMounted) return;

        setFeaturedState({
          allItems: response.data,
          items: response.data
            .filter((product) => product.featured)
            .slice(0, 4),
          loading: false,
          error: null,
        });
      } catch (error: unknown) {
        if (!isMounted) return;

        setFeaturedState({
          allItems: [],
          items: [],
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to load featured products.",
        });
      }
    }

    void loadFeaturedProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const heroProduct = useMemo(
    () =>
      featuredState.allItems.find(
        (product) => product.id === heroHotspot.productId,
      ),
    [featuredState.allItems],
  );

  const discountedProducts = useMemo(
    () =>
      featuredState.allItems
        .filter((product) => typeof product.compareAtPrice === "number")
        .slice(0, 8),
    [featuredState.allItems],
  );

  return (
    <div>
      {/* Hero section */}
      <HomeHero heroProduct={heroProduct} hotspot={heroHotspot} />

      {/* Category cards */}
      <HomeCategoryCards loading={featuredState.loading} />

      {/* Discounted products */}
      <HomeDiscountedProducts products={discountedProducts} />

      {/* Reviewer feedback */}
      <HomeReviewerFeedback />

      {/* Contact us */}
      <HomeContactUs />
    </div>
  );
}

export default Home;
