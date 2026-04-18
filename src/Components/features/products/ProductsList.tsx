import { Suspense, lazy, useMemo, useState, useTransition } from "react";

import {
  CATEGORY_OPTIONS,
  DEFAULT_CATEGORY,
  type ProductCategoryLabel,
} from "@/constants/categories";
import { ROUTES } from "@/constants/routes";

import {
  fetchProducts,
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from "@/components/features/products/productsSlice";
import Button from "@/components/ui/Button";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import ProductGridSkeleton from "@/components/ui/ProductGridSkeleton";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { useProductFilters } from "@hooks/useProductFilters";

const ProductGrid = lazy(
  () => import("@/components/features/products/ProductGrid"),
);

type SortOption = "newest" | "price-asc" | "price-desc";

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function ProductsList(): JSX.Element {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const productsStatus = useAppSelector(selectProductsStatus);
  const productsError = useAppSelector(selectProductsError);
  const { activeCategory, setCategory } = useProductFilters();
  const [sortOrder, setSortOrder] = useState<SortOption>("newest");
  const [gridResetKey, setGridResetKey] = useState(0);
  const [isPending, startTransition] = useTransition();
  const activeIndex = CATEGORY_OPTIONS.findIndex(
    ({ label }) => label === activeCategory,
  );

  const sortedProducts = useMemo(() => {
    const nextProducts = [...products];

    switch (sortOrder) {
      case "price-asc":
        return nextProducts.sort(
          (a, b) => (a.unitPrice ?? a.price) - (b.unitPrice ?? b.price),
        );
      case "price-desc":
        return nextProducts.sort(
          (a, b) => (b.unitPrice ?? b.price) - (a.unitPrice ?? a.price),
        );
      case "newest":
      default:
        return nextProducts.sort((a, b) => {
          if (a.isNew === b.isNew) {
            return Number(b.id) - Number(a.id);
          }

          return Number(b.isNew) - Number(a.isNew);
        });
    }
  }, [products, sortOrder]);

  function handleCategoryChange(category: ProductCategoryLabel): void {
    startTransition(() => {
      setCategory(category);
    });
  }

  function handleRetry(): void {
    setGridResetKey((current) => current + 1);
    void dispatch(
      fetchProducts(
        activeCategory === DEFAULT_CATEGORY ? undefined : activeCategory,
      ),
    );
  }

  if (productsStatus === "loading" && !products.length) {
    return (
      <section className="mx-auto w-[min(100%-2rem,72rem)] px-4 py-16 sm:px-6 lg:px-8">
        <ProductGridSkeleton />
      </section>
    );
  }

  if (productsStatus === "failed") {
    return (
      <section className="mx-auto w-[min(100%-2rem,72rem)] px-4 py-16 sm:px-6 lg:px-8">
        <div
          className="rounded-[2rem] border border-[#ead9ca] bg-[#fff8f3] px-6 py-10 text-center shadow-[0_20px_50px_-40px_rgba(36,25,21,0.34)]"
          role="alert"
        >
          <h1 className="font-['Playfair_Display',serif] text-3xl text-[#5a4034]">
            Products couldn&apos;t be loaded
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#5b463d]">
            {productsError ?? "Failed to load products."}
          </p>
          <div className="mt-6">
            <Button onClick={handleRetry} type="button">
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-[min(100%-2rem,72rem)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.28em] text-[#8c6659]">
              Collection
            </p>
            <h1 className="mt-3 font-['Playfair_Display',serif] text-3xl text-[#5a4034] sm:text-4xl">
              Filter by category, then refine by finish and price.
            </h1>
            <p className="mt-3 font-['Quicksand',sans-serif] text-base leading-7 text-[#5b463d]">
              Showing {sortedProducts.length} product
              {sortedProducts.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="w-full max-w-xs">
            <label
              className="mb-2 block font-['Quicksand',sans-serif] text-xs font-semibold uppercase tracking-[0.22em] text-[#8c6659]"
              htmlFor="products-sort"
            >
              Sort By
            </label>
            <div className="relative">
              <select
                className="w-full appearance-none rounded-full border border-[#d9c0ae] bg-white px-4 py-3 pr-11 font-['Quicksand',sans-serif] text-sm text-[#5a4034] shadow-[0_14px_32px_-26px_rgba(36,25,21,0.4)] transition-colors duration-150 ease-in focus:border-[#5a4034] focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
                id="products-sort"
                onChange={(event) =>
                  setSortOrder(event.target.value as SortOption)
                }
                value={sortOrder}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-[#8c6659]"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M7 10l5 5 5-5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-[#ead9ca] bg-[#fffaf5] p-2 shadow-[0_18px_42px_-34px_rgba(36,25,21,0.28)]">
          <div className="relative grid grid-cols-4 gap-2">
            <div
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-0 z-0 w-[calc(25%-0.375rem)] rounded-[1.2rem] bg-[#5a4034] transition-transform duration-200 ease-in"
              style={{
                transform: `translateX(${activeIndex < 0 ? 0 : activeIndex * 100}%)`,
              }}
            />
            {CATEGORY_OPTIONS.map(({ label }) => (
              <button
                key={label}
                aria-current={activeCategory === label}
                className={[
                  "relative z-10 rounded-[1.2rem] px-3 py-3 text-center font-['Quicksand',sans-serif] text-xs font-semibold transition-colors duration-150 ease-in sm:px-4 sm:text-sm",
                  activeCategory === label
                    ? "text-white"
                    : "text-[#5a4034] hover:text-[#3f2d25]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2",
                ].join(" ")}
                onClick={() =>
                  handleCategoryChange(label as ProductCategoryLabel)
                }
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <Suspense fallback={<ProductGridSkeleton />}>
          <div
            aria-busy={isPending}
            className={`transition-opacity duration-200 ease-in ${isPending ? "opacity-50" : "opacity-100"}`}
          >
            <ErrorBoundary
              fallback={(error) => (
                <div
                  className="rounded-[2rem] border border-[#ead9ca] bg-[#fff8f3] px-6 py-10 text-center shadow-[0_20px_50px_-40px_rgba(36,25,21,0.34)]"
                  role="alert"
                >
                  <h2 className="font-['Playfair_Display',serif] text-3xl text-[#5a4034]">
                    The product grid hit an issue
                  </h2>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#5b463d]">
                    {error.message || "The product grid could not be rendered."}
                  </p>
                  <div className="mt-6">
                    <Button
                      onClick={() => setGridResetKey((current) => current + 1)}
                      type="button"
                    >
                      Retry Grid
                    </Button>
                  </div>
                </div>
              )}
              resetKey={`${activeCategory}-${sortOrder}-${gridResetKey}`}
            >
              {sortedProducts.length ? (
                <ProductGrid products={sortedProducts} />
              ) : (
                <div className="rounded-[2rem] border border-dashed border-[#d9c0ae] bg-[#fffaf5] px-6 py-12 text-center">
                  <h2 className="font-['Playfair_Display',serif] text-3xl text-[#5a4034]">
                    No products in this category
                  </h2>
                  <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#5b463d]">
                    Shift back to the full collection to browse every skincare,
                    makeup, and new arrival currently available.
                  </p>
                  <div className="mt-6">
                    <Button to={ROUTES.PRODUCTS} variant="secondary">
                      View All
                    </Button>
                  </div>
                </div>
              )}
            </ErrorBoundary>
          </div>
        </Suspense>
      </div>
    </section>
  );
}

export default ProductsList;
