import {
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useSearchParams } from "react-router-dom";

import {
  CATEGORY_OPTIONS,
  DEFAULT_CATEGORY,
  type ProductCategoryLabel,
} from "@/constants/categories";
import {
  getProductFocusFromSearchParam,
  matchesProductFocus,
  PRODUCT_FOCUS_LABELS,
} from "@/constants/productFocus";
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

type SortOption = "newest" | "top-seller" | "price-asc" | "price-desc";

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "top-seller", label: "Top Seller" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function ProductsList(): JSX.Element {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const productsStatus = useAppSelector(selectProductsStatus);
  const productsError = useAppSelector(selectProductsError);
  const { activeCategory, setCategory } = useProductFilters();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortOrder, setSortOrder] = useState<SortOption>("newest");
  const [gridResetKey, setGridResetKey] = useState(0);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const searchQuery = (searchParams.get("q") ?? "").trim().toLowerCase();
  const isSaleFilterActive = searchParams.get("sale") === "true";
  const isTopSellerFilterActive = searchParams.get("topseller") === "true";
  const activeFocus = getProductFocusFromSearchParam(searchParams.get("focus"));

  const sortedProducts = useMemo(() => {
    const nextProducts = [...products];

    switch (sortOrder) {
      case "top-seller":
        return nextProducts.sort((a, b) => {
          if (Boolean(a.topSeller) === Boolean(b.topSeller)) {
            return Number(b.id) - Number(a.id);
          }

          return Number(Boolean(b.topSeller)) - Number(Boolean(a.topSeller));
        });
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

  const filteredProducts = useMemo(() => {
    const saleFilteredProducts = isSaleFilterActive
      ? sortedProducts.filter((product) => product.compareAtPrice)
      : sortedProducts;
    const topSellerFilteredProducts = isTopSellerFilterActive
      ? saleFilteredProducts.filter((product) => product.topSeller)
      : saleFilteredProducts;
    const focusFilteredProducts = topSellerFilteredProducts.filter((product) =>
      matchesProductFocus(product, activeFocus),
    );

    if (!searchQuery) {
      return focusFilteredProducts;
    }

    return focusFilteredProducts.filter((product) => {
      const searchableText = [
        product.name,
        product.category,
        product.description,
        product.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchQuery);
    });
  }, [
    activeFocus,
    isSaleFilterActive,
    isTopSellerFilterActive,
    searchQuery,
    sortedProducts,
  ]);

  useEffect(() => {
    if (productsStatus !== "succeeded") return;

    setIsSearchLoading(true);
    const timeoutId = window.setTimeout(() => setIsSearchLoading(false), 250);

    return () => window.clearTimeout(timeoutId);
  }, [
    productsStatus,
    searchQuery,
    isSaleFilterActive,
    isTopSellerFilterActive,
  ]);

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

  function handleToggleFilter(
    key: "sale" | "topseller",
    isActive: boolean,
  ): void {
    const nextParams = new URLSearchParams(searchParams);

    if (isActive) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, "true");
    }

    setSearchParams(nextParams);
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
        <div className="overflow-hidden rounded-[1.1rem] bg-[linear-gradient(135deg,#fff7f8_0%,#fff0f2_42%,#fde6eb_100%)] p-5 sm:p-7 md:p-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[0.72rem] font-[500] uppercase tracking-[0.28em] text-[#8c1d40]">
              Collection
              </p>
              <h1 className="mt-3 font-['Playfair_Display',serif] text-[1.9rem] leading-[0.98] text-[#3e0f1f] sm:text-[2.5rem]">
                The full beauty edit, shaped like the home page.
              </h1>
              <p className="mt-4 text-[0.92rem] leading-7 text-[#6c4a4e]">
                Showing {filteredProducts.length} product
                {filteredProducts.length === 1 ? "" : "s"}
                {activeFocus
                  ? ` for ${PRODUCT_FOCUS_LABELS[activeFocus].toLowerCase()}`
                  : ""}
                {searchQuery ? ` for "${searchParams.get("q")}"` : ""}.
                {isSaleFilterActive ? " Sale filter active." : ""}
                {isTopSellerFilterActive ? " Top Seller filter active." : ""}
              </p>
            </div>

            <div className="w-full max-w-xs">
              <label
                className="mb-2 block text-[0.72rem] font-[500] uppercase tracking-[0.22em] text-[#8c1d40]"
                htmlFor="products-sort"
              >
                Sort By
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-full border border-[#8c1d40]/15 bg-white px-4 py-3 pr-11 text-sm text-[#4a2a2d] shadow-[0_14px_32px_-26px_rgba(85,0,0,0.28)] transition-colors duration-150 ease-in focus:border-[#8c1d40] focus:outline-none focus:ring-2 focus:ring-[#8c1d40]/20"
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
                  className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-[#8c1d40]"
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
        </div>

        <div className="rounded-[1.1rem] bg-[#fff0f2] p-2 shadow-[0_18px_42px_-34px_rgba(85,0,0,0.18)]">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {CATEGORY_OPTIONS.map(({ label }) => (
              <button
                key={label}
                aria-current={activeCategory === label}
                className={[
                  "min-h-[3rem] rounded-[0.95rem] px-3 py-3 text-center text-xs font-[500] transition-all duration-150 ease-in sm:min-h-0 sm:rounded-[1rem] sm:px-4 sm:text-sm",
                  activeCategory === label
                    ? "bg-[#8c1d40] text-white shadow-[0_14px_28px_rgba(140,29,64,0.18)]"
                    : "text-[#4a2a2d] hover:bg-white/70 hover:text-[#3f0f1b]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8c1d40]/25",
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

        <div className="flex flex-wrap gap-3">
          <button
            className={[
              "rounded-full px-4 py-2 text-[0.76rem] font-[500] uppercase tracking-[0.18em] transition-all duration-150 ease-in",
              isSaleFilterActive
                ? "bg-[#8c1d40] text-white shadow-[0_14px_28px_rgba(140,29,64,0.18)]"
                : "bg-[#fff0f2] text-[#8c1d40] hover:bg-[#fde6eb]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8c1d40]/25",
            ].join(" ")}
            onClick={() => handleToggleFilter("sale", isSaleFilterActive)}
            type="button"
          >
            On Sale
          </button>

          <button
            className={[
              "rounded-full px-4 py-2 text-[0.76rem] font-[500] uppercase tracking-[0.18em] transition-all duration-150 ease-in",
              isTopSellerFilterActive
                ? "bg-[#8c1d40] text-white shadow-[0_14px_28px_rgba(140,29,64,0.18)]"
                : "bg-[#fff0f2] text-[#8c1d40] hover:bg-[#fde6eb]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8c1d40]/25",
            ].join(" ")}
            onClick={() =>
              handleToggleFilter("topseller", isTopSellerFilterActive)
            }
            type="button"
          >
            Top Seller
          </button>
        </div>

        <Suspense fallback={<ProductGridSkeleton />}>
          <div
            aria-busy={isPending || isSearchLoading}
            className={`transition-opacity duration-200 ease-in ${isPending ? "opacity-50" : "opacity-100"}`}
          >
            <ErrorBoundary
              fallback={(error) => (
                <div
                  className="rounded-[1.1rem] bg-[#fff0f2] px-6 py-10 text-center shadow-[0_20px_50px_-40px_rgba(85,0,0,0.22)]"
                  role="alert"
                >
                  <h2 className="font-['Playfair_Display',serif] text-3xl text-[#3e0f1f]">
                    The product grid hit an issue
                  </h2>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#6c4a4e]">
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
              resetKey={`${activeCategory}-${sortOrder}-${isSaleFilterActive}-${isTopSellerFilterActive}-${gridResetKey}`}
            >
              {isSearchLoading ? (
                <ProductGridSkeleton />
              ) : filteredProducts.length ? (
                <ProductGrid products={filteredProducts} />
              ) : (
                <div className="rounded-[1.1rem] border border-dashed border-[#8c1d40]/20 bg-[#fff7f8] px-6 py-12 text-center">
                  <h2 className="font-['Playfair_Display',serif] text-3xl text-[#3e0f1f]">
                    No matching products
                  </h2>
                  <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#6c4a4e]">
                    Try a broader search term or switch back to the full
                    collection to browse every currently available product.
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
