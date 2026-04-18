import type { Product } from '@/types';

import {
  CATEGORY_OPTIONS,
  type ProductCategoryLabel,
} from '@/constants/categories';

import ProductCard from '@/components/features/products/Product';
import {
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from '@/components/features/products/productsSlice';
import Error from '@/components/ui/Error';
import Spinner from '@/components/ui/Spinner';
import { useAppSelector } from '@store/hooks';
import { useProductFilters } from '@hooks/useProductFilters';

function ProductsList(): JSX.Element {
  const products = useAppSelector(selectProducts);
  const productsStatus = useAppSelector(selectProductsStatus);
  const productsError = useAppSelector(selectProductsError);
  const { activeCategory, setCategory } = useProductFilters();

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
              onClick={() => setCategory(label as ProductCategoryLabel)}
            >
              {label}
            </p>
          ))}
        </div>
      </div>

      {/* 🔥 Corrected to map over products from the selected category */}
        <div>
        {products.map((product: Product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}

export default ProductsList;
