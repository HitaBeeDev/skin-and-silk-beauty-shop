import { Suspense, lazy, useTransition } from 'react';

import {
  CATEGORY_OPTIONS,
  type ProductCategoryLabel,
} from '@/constants/categories';

import {
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from '@/components/features/products/productsSlice';
import Error from '@/components/ui/Error';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import ProductGridSkeleton from '@/components/ui/ProductGridSkeleton';
import { useAppSelector } from '@store/hooks';
import { useProductFilters } from '@hooks/useProductFilters';

const ProductGrid = lazy(() => import('@/components/features/products/ProductGrid'));

function ProductsList(): JSX.Element {
  const products = useAppSelector(selectProducts);
  const productsStatus = useAppSelector(selectProductsStatus);
  const productsError = useAppSelector(selectProductsError);
  const { activeCategory, setCategory } = useProductFilters();
  const [isPending, startTransition] = useTransition();

  function handleCategoryChange(category: ProductCategoryLabel): void {
    startTransition(() => {
      setCategory(category);
    });
  }

  if (productsStatus === 'loading' && !products.length) {
    return <ProductGridSkeleton />;
  }

  if (productsStatus === 'failed') {
    return <Error message={productsError ?? 'Failed to load products.'} />;
  }

  return (
    <div>
      <div>
        <p>
          Shop by Categories
        </p>

        <div>
          {CATEGORY_OPTIONS.map(({ label }) => (
            <button
              key={label}
              aria-current={activeCategory === label}
              className="rounded-md px-2 py-1 text-[#5A4034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
              onClick={() => handleCategoryChange(label as ProductCategoryLabel)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <Suspense
        fallback={<ProductGridSkeleton />}
      >
        <div>
          <div
            aria-busy={isPending}
            className={`transition-opacity duration-150 ${isPending ? 'opacity-65' : 'opacity-100'}`}
          >
            {isPending ? <p>Updating products…</p> : null}
            <ErrorBoundary
              fallback={(error) => (
                <Error
                  message={
                    error.message || 'The product grid could not be rendered.'
                  }
                />
              )}
              resetKey={activeCategory}
            >
              <ProductGrid products={products} />
            </ErrorBoundary>
          </div>
        </div>
      </Suspense>
    </div>
  );
}

export default ProductsList;
