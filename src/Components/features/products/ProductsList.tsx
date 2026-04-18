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
import Skeleton from '@/components/ui/Skeleton';
import Spinner from '@/components/ui/Spinner';
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
    return <Spinner label="Loading products" />;
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
            <p
              key={label}
              aria-current={activeCategory === label}
              onClick={() => handleCategoryChange(label as ProductCategoryLabel)}
            >
              {label}
            </p>
          ))}
        </div>
      </div>

      <Suspense
        fallback={
          <div aria-label="Loading products grid">
            <Skeleton height="14rem" />
            <div style={{ marginTop: '1rem' }}>
              <Skeleton height="14rem" />
            </div>
          </div>
        }
      >
        <div>
          <div
            aria-busy={isPending}
            style={{
              opacity: isPending ? 0.65 : 1,
              transition: 'opacity 150ms ease',
            }}
          >
            {isPending ? <p>Updating products…</p> : null}
            <ProductGrid products={products} />
          </div>
        </div>
      </Suspense>
    </div>
  );
}

export default ProductsList;
