import { useEffect, useMemo, useState } from "react";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "@/types";

import HomeHero from "@/components/ui/home/HomeHero";
import Skeleton from "@/components/ui/Skeleton";
import img2 from "@/assets/new/img2.png";
import img3 from "@/assets/new/img3.png";
import img4 from "@/assets/new/img4.png";
import { ROUTES } from "@/constants/routes";
import { getProducts } from "@/services/productsService";

type FeaturedState = {
  allItems: Product[];
  items: Product[];
  loading: boolean;
  error: string | null;
};

const categoryCards = [
  {
    title: "For Face",
    description:
      "Gentle cleansers, brightening serums, and daily hydration for a balanced, healthy-looking complexion.",
    image: img2,
    alt: "Face care icon",
    focus: "face",
  },
  {
    title: "For Eyes",
    description:
      "Target puffiness, dryness, and fine lines with lightweight care made for the delicate eye area.",
    image: img3,
    alt: "Eye care icon",
    focus: "eyes",
  },
  {
    title: "For Lips",
    description:
      "Nourishing balms and soft-gloss treatments to keep lips smooth, supple, and comfortably hydrated.",
    image: img4,
    alt: "Lip care icon",
    focus: "lips",
  },
] as const;

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

  return (
    <div>
      <HomeHero heroProduct={heroProduct} hotspot={heroHotspot} />

      {featuredState.loading ? (
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="relative min-h-[9.75rem] rounded-[1.1rem] bg-[#fff0f0] px-4 py-4 sm:px-5 md:min-h-[10rem] lg:px-6"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <Skeleton className="h-[3.5rem] w-[3.5rem] shrink-0 rounded-[0.6rem] sm:h-[4rem] sm:w-[4rem]" />
                <div className="min-w-0 flex-1 space-y-2 pr-1 pb-8 sm:pr-2 sm:pb-9">
                  <Skeleton className="h-5 w-24 rounded-full sm:h-6 sm:w-28" />
                  <Skeleton className="h-3 w-full rounded-full" />
                  <Skeleton className="h-3 w-[85%] rounded-full" />
                </div>
              </div>

              <Skeleton className="absolute right-4 bottom-4 h-[1.6rem] w-[3.2rem] rounded-full sm:right-5 md:right-6" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 md:mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5 xl:grid-cols-3">
          {categoryCards.map((card) => (
            <div
              key={card.title}
              className="relative min-h-[9.75rem] rounded-[1.1rem] bg-[#fff0f0] px-4 py-4 sm:px-5 md:min-h-[10rem] lg:px-6"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="h-[3.5rem] w-[3.5rem] shrink-0 overflow-hidden rounded-[0.6rem] border border-[#550000]/30 p-[0.55rem] sm:h-[4rem] sm:w-[4rem] sm:p-[0.6rem]">
                  <img
                    src={card.image}
                    alt={card.alt}
                    className="block h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1 pr-1 pb-8 sm:pr-2 sm:pb-9">
                  <p className="font-['Playfair_Display',serif] text-[1.1rem] font-[400] text-[#550000] sm:text-[1.2rem] lg:text-[1.3rem]">
                    {card.title}
                  </p>

                  <p className="w-full font-['Playfair_Display',serif] text-[0.72rem] font-[300] leading-[1.45] text-[#550000] sm:text-[0.75rem]">
                    {card.description}
                  </p>
                </div>
              </div>

              <Link
                aria-label={`View ${card.focus} products`}
                className="absolute right-4 bottom-4 flex h-[1.6rem] w-[3.2rem] items-center justify-center rounded-full border border-[#900c0c]
                transition-all duration-300 hover:border-[#ffdddd] hover:bg-[#ffdddd] sm:right-5 md:right-6"
                to={`${ROUTES.PRODUCTS}?category=all&focus=${card.focus}`}
              >
                <MoveRight strokeWidth={1.5} className="text-[#900c0c]" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
