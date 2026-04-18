import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import type { Product } from "@/types";

import { ROUTES } from "@/constants/routes";

import { formatCurrency } from "@/components/utils/helpers";
import { getProducts } from "@/services/productsService";
import heroImage from "@/assets/new/img1.webp";

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

  return (
    <div className="mt-6 flex w-full min-w-0 flex-col gap-5 md:grid md:h-[32rem] md:grid-cols-2 md:items-center md:justify-center">
      <div
        className="order-2 md:order-1 col-span-1 flex h-full w-full min-w-0 flex-col items-start justify-center 
      rounded-t-[1.1rem] bg-[#550000] p-5 sm:p-7"
      >
        <p
          className="mr-2 ml-2 font-['Playfair_Display',serif] text-[2rem] font-[500] leading-none text-[#fff0f0] 
        sm:text-[2.6rem] md:text-[4rem]"
        >
          Luxury Beauty Collection
        </p>

        <Link
          className="group mt-6 md:mt-8 flex items-center ml-2"
          to={ROUTES.PRODUCTS}
        >
          <div
            className="relative z-10 flex h-[2rem] w-[2rem] items-center justify-center rounded-full bg-white 
          transition-all duration-300 cursor-pointer group-hover:bg-[#fff0f0]"
          >
            <ArrowUpRight className="text-black" size={13} strokeWidth={2} />
          </div>

          <div
            className="-ml-[1.2rem] flex h-[2rem] pl-7 pr-6 items-center justify-center rounded-full bg-black px-5
          cursor-pointer transition-colors duration-300 group-hover:bg-[#900c0c]"
          >
            <p className="text-[0.7rem] font-[400] tracking-[0.02em] text-white">
              Open Store
            </p>
          </div>
        </Link>

        <div className="mt-5 sm:mt-10 ml-2 grid w-full min-w-0 items-start gap-6 md:grid-cols-2">
          <div className="col-span-1 min-w-0">
            <p className="text-white text-[0.9rem] font-[300]">
              Discover prestige skincare, refined makeup, and elevated
              essentials curated to make every ritual feel intentional,
              sensorial, and beautifully complete.
            </p>
          </div>

          <div className="col-span-1 flex min-w-0 flex-row flex-wrap items-center justify-start gap-2">
            <div className="flex justify-center items-center h-[2.1rem] border border-[#fff0f0] rounded-full px-5">
              <p className="text-white text-[0.7rem] font-[300]">
                Clé de Peau Beauté
              </p>
            </div>

            <div className="flex justify-center items-center h-[2.1rem] border border-[#fff0f0] rounded-full px-5">
              <p className="text-white text-[0.7rem] font-[300]">
                Sisley Paris
              </p>
            </div>

            <div className="flex justify-center items-center h-[2.1rem] border border-[#fff0f0] rounded-full px-5">
              <p className="text-white text-[0.7rem] font-[300]">Valmont</p>
            </div>

            <div className="flex justify-center items-center h-[2.1rem] border border-[#fff0f0] rounded-full px-5">
              <p className="text-white text-[0.7rem] font-[300]">
                Augustinus Bader
              </p>
            </div>

            <div className="flex justify-center items-center h-[2.1rem] border border-[#fff0f0] rounded-full px-5">
              <p className="text-white text-[0.7rem] font-[300]">La Prairie</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="order-1 md:order-2 relative col-span-1 h-[18rem] sm:h-[24rem] w-full min-w-0 overflow-hidden 
      rounded-t-[1.1rem] md:h-full"
      >
        <img
          aria-hidden="true"
          alt=""
          className="h-full w-full object-cover"
          fetchPriority="high"
          height={7038}
          loading="eager"
          src={heroImage}
          width={4912}
        />

        {heroProduct ? (
          <div
            className="absolute z-10"
            style={{ left: heroHotspot.x, top: heroHotspot.y }}
          >
            <Link
              className="group relative block -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none"
              to={ROUTES.PRODUCT_DETAIL.replace(":id", heroProduct.id)}
            >
              <span
                className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full 
              border border-white/60 bg-white/20 animate-ping"
              />
              <span
                className="relative flex h-5 w-5 items-center justify-center rounded-full border border-white/80
               bg-white shadow-[0_12px_32px_rgba(36,25,21,0.28)]"
              >
                <span className="h-2 w-2 rounded-full bg-[#241915]" />
              </span>

              <div
                className="pointer-events-none absolute right-0 top-8 w-[min(18rem,calc(100vw-3rem))] rounded-[1.1rem] bg-white/30 
              p-5 text-left text-[#241915] opacity-0 shadow-[0_24px_60px_rgba(36,25,21,0.24)] transition-all duration-200 
              ease-in group-hover:pointer-events-auto group-hover:translate-y-1 
              group-hover:opacity-100 group-focus-visible:pointer-events-auto group-focus-visible:translate-y-1 
              group-focus-visible:opacity-100 backdrop-blur-lg md:left-[-8.5rem] md:right-auto md:w-[19rem]"
              >
                <p className="text-[0.6rem] font-[500] uppercase tracking-[0.18em] text-[#8c6659]">
                  {heroProduct.category}
                </p>

                <p className="mt-2 text-[0.85rem] font-[500] leading-5 text-[#5a4034]">
                  {heroProduct.name}
                </p>

                <p className="text-[0.7rem] leading-5 text-[#5b463d] mt-[0.1rem]">
                  {heroProduct.description}
                </p>

                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#5a4034]">
                  {formatCurrency(heroProduct.price)}
                </p>
              </div>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Home;
