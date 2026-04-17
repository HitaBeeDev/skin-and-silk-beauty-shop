import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { Product } from '@/types';

import {
  CATEGORY_OPTIONS,
  CATEGORY_SLUG_BY_LABEL,
  DEFAULT_CATEGORY,
  getCategoryLabelBySlug,
  type ProductCategoryLabel,
} from '@/constants/categories';

import ProductCard from '@/components/features/products/Product';
import {
  fetchProducts,
  selectActiveCategory,
  selectProducts,
  selectProductsError,
  selectProductsStatus,
  setActiveCategory,
} from '@/components/features/products/productsSlice';
import Error from '@/components/ui/Error';
import Spinner from '@/components/ui/Spinner';
import { useAppDispatch, useAppSelector } from '@store/hooks';

function ProductsList(): JSX.Element {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');
  const products = useAppSelector(selectProducts);
  const activeCategory = useAppSelector(selectActiveCategory);
  const productsStatus = useAppSelector(selectProductsStatus);
  const productsError = useAppSelector(selectProductsError);

  useEffect(() => {
    const categoryFromUrl = getCategoryLabelBySlug(categorySlug) ?? DEFAULT_CATEGORY;

    if (!categorySlug) {
      setSearchParams(
        { category: CATEGORY_SLUG_BY_LABEL[categoryFromUrl] },
        { replace: true }
      );
    }

    if (categoryFromUrl !== activeCategory) {
      dispatch(setActiveCategory(categoryFromUrl));
      return;
    }

    void dispatch(fetchProducts(activeCategory));
  }, [activeCategory, categorySlug, dispatch, setSearchParams]);

  function handleCategoryChange(category: ProductCategoryLabel): void {
    dispatch(setActiveCategory(category));
    setSearchParams({ category: CATEGORY_SLUG_BY_LABEL[category] });
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
              onClick={() => handleCategoryChange(label)}
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
