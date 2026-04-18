import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  CATEGORY_SLUG_BY_LABEL,
  DEFAULT_CATEGORY,
  getCategoryLabelBySlug,
  type ProductCategoryLabel,
} from '@/constants/categories';
import {
  fetchProducts,
  selectActiveCategory,
  setActiveCategory,
} from '@/components/features/products/productsSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';

type UseProductFiltersResult = {
  activeCategory: ProductCategoryLabel;
  setCategory: (category: ProductCategoryLabel) => void;
};

export function useProductFilters(): UseProductFiltersResult {
  const dispatch = useAppDispatch();
  const activeCategory = useAppSelector(selectActiveCategory);
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');

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

  function setCategory(category: ProductCategoryLabel): void {
    dispatch(setActiveCategory(category));
    setSearchParams({ category: CATEGORY_SLUG_BY_LABEL[category] });
  }

  return {
    activeCategory,
    setCategory,
  };
}

export default useProductFilters;
