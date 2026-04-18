import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import type { Product } from "@/types";

import { CATEGORY_LABELS, ProductCategory } from "@/constants/categories";
import { ROUTES } from "@/constants/routes";

import ProductGrid from "@/components/features/products/ProductGrid";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/ui/Error";
import { getProducts } from "@/services/productsService";
import heroImage from "@/assets/home4.jpg";
import skincareImage from "@/assets/home1.jpg";
import makeupImage from "@/assets/home2.jpg";
import arrivalsImage from "@/assets/home3.jpg";

type FeaturedState = {
  items: Product[];
  loading: boolean;
  error: string | null;
};

const categoryCards = [
  {
    label: CATEGORY_LABELS[ProductCategory.SkinCare],
    slug: ProductCategory.SkinCare,
    image: skincareImage,
  },
  {
    label: CATEGORY_LABELS[ProductCategory.Makeup],
    slug: ProductCategory.Makeup,
    image: makeupImage,
  },
  {
    label: CATEGORY_LABELS[ProductCategory.NewArrivals],
    slug: ProductCategory.NewArrivals,
    image: arrivalsImage,
  },
] as const;

function buildProductsCategoryHref(category: ProductCategory): string {
  const params = new URLSearchParams({ category });
  return `${ROUTES.PRODUCTS}?${params.toString()}`;
}

function Home(): JSX.Element {
  const [featuredState, setFeaturedState] = useState<FeaturedState>({
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
          items: response.data
            .filter((product) => product.featured)
            .slice(0, 4),
          loading: false,
          error: null,
        });
      } catch (error: unknown) {
        if (!isMounted) return;

        setFeaturedState({
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

  const featuredFallback = useMemo(
    () => Array.from({ length: 4 }, (_, index) => index),
    [],
  );

  return (
    <div className="bg-[linear-gradient(180deg,#fffdf9_0%,#fff6ee_52%,#fffdf9_100%)] text-[#241915]">
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] bg-[#2b1d18] shadow-[0_30px_90px_-44px_rgba(36,25,21,0.65)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative flex flex-col justify-center gap-6 px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,177,137,0.28),transparent_38%),linear-gradient(135deg,rgba(24,16,13,0.9),rgba(60,39,32,0.76))]" />
            <div className="relative z-10 max-w-xl">
              <p className="mb-4 font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.3em] text-[#f2ddcc]">
                Skin &amp; Silk
              </p>
              <h1 className="font-['Playfair_Display',serif] text-4xl leading-tight text-[#fff7f0] sm:text-5xl lg:text-6xl">
                A refined ritual for luminous skin, polished color, and modern
                indulgence.
              </h1>
              <p className="mt-5 max-w-lg font-['Quicksand',sans-serif] text-base leading-7 text-[#f2ddcc] sm:text-lg">
                Discover prestige skincare, editorial makeup, and elevated
                essentials curated to make every routine feel considered,
                tactile, and beautifully complete.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button size="lg" to={ROUTES.PRODUCTS} variant="primary">
                  Shop Now
                </Button>
                <Link
                  className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#f7e9de] underline-offset-4 transition-colors duration-150 ease-in hover:text-white hover:underline"
                  to={`${ROUTES.HOME}#brand-story`}
                >
                  Read the story
                </Link>
              </div>
            </div>
          </div>

          <div className="relative min-h-[24rem]">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,21,17,0.08),rgba(31,21,17,0.34))]" />
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
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.28em] text-[#8c6659]">
                Curated Edit
              </p>
              <h2 className="mt-3 font-['Playfair_Display',serif] text-3xl text-[#5a4034] sm:text-4xl">
                Featured Products
              </h2>
              <p className="mt-3 font-['Quicksand',sans-serif] text-base leading-7 text-[#5b463d]">
                Four signatures from the collection, selected to anchor a
                complete routine with texture, treatment, and a polished finish.
              </p>
            </div>
            <Link
              className="hidden font-['Quicksand',sans-serif] text-sm font-semibold text-[#5a4034] transition-colors duration-150 ease-in hover:text-[#3f2d25] hover:underline md:inline"
              to={ROUTES.PRODUCTS}
            >
              View All
            </Link>
          </div>

          {featuredState.loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {featuredFallback.map((item) => (
                <div
                  key={item}
                  aria-hidden="true"
                  className="h-[27rem] animate-pulse rounded-[2rem] border border-[#ead9ca] bg-white/70"
                />
              ))}
            </div>
          ) : null}

          {featuredState.error ? (
            <ErrorState message={featuredState.error} />
          ) : null}

          {!featuredState.loading && !featuredState.error ? (
            <ProductGrid products={featuredState.items} />
          ) : null}

          <div className="mt-6 md:hidden">
            <Link
              className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#5a4034] transition-colors duration-150 ease-in hover:text-[#3f2d25] hover:underline"
              to={ROUTES.PRODUCTS}
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="max-w-2xl">
            <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.28em] text-[#8c6659]">
              Shop by Mood
            </p>
            <h2 className="mt-3 font-['Playfair_Display',serif] text-3xl text-[#5a4034] sm:text-4xl">
              Explore by Category
            </h2>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {categoryCards.map(({ label, slug, image }) => (
              <Link
                key={slug}
                className="group overflow-hidden rounded-[2rem] border border-[#ead9ca] bg-white shadow-[0_22px_55px_-40px_rgba(36,25,21,0.4)] transition-[transform,box-shadow] duration-200 ease-in hover:-translate-y-1 hover:shadow-[0_28px_70px_-34px_rgba(36,25,21,0.48)]"
                to={buildProductsCategoryHref(slug)}
              >
                <div className="aspect-[5/4] overflow-hidden bg-[#f7ede5]">
                  <img
                    alt={`${label} collection`}
                    className="h-full w-full object-cover transition-transform duration-300 ease-in group-hover:scale-[1.04]"
                    height={7360}
                    loading="lazy"
                    src={image}
                    width={4912}
                  />
                </div>
                <div className="flex items-center justify-between gap-4 px-6 py-5">
                  <div>
                    <p className="font-['Playfair_Display',serif] text-2xl text-[#5a4034]">
                      {label}
                    </p>
                    <p className="mt-2 font-['Quicksand',sans-serif] text-sm text-[#5b463d]">
                      Discover the edit
                    </p>
                  </div>
                  <span className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.2em] text-[#8c6659]">
                    Open
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8" id="brand-story">
        <div className="mx-auto grid w-full max-w-6xl gap-10 rounded-[2rem] bg-[#f8eee6] px-6 py-10 shadow-[0_24px_60px_-42px_rgba(36,25,21,0.35)] md:grid-cols-[0.9fr_1.1fr] md:px-10 md:py-12">
          <div>
            <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.28em] text-[#8c6659]">
              Brand Story
            </p>
            <h2 className="mt-3 font-['Playfair_Display',serif] text-3xl text-[#5a4034] sm:text-4xl">
              Skin &amp; Silk is built around beauty that feels deliberate.
            </h2>
          </div>

          <div className="space-y-4 font-['Quicksand',sans-serif] text-base leading-8 text-[#4d3932]">
            <p>
              We curate formulas, textures, and finishes that bring a couture
              sensibility to the everyday, pairing treatment-first skincare with
              makeup that looks polished in every light.
            </p>
            <p>
              The result is a tighter, more considered edit: products chosen for
              performance, ceremony, and the quiet confidence that comes from a
              routine designed with taste.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
