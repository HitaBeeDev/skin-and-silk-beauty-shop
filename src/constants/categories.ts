export enum ProductCategory {
  SkinCare = 'skin-care',
  Makeup = 'makeup',
  NewArrivals = 'new-arrivals',
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  [ProductCategory.SkinCare]: 'Skin Care',
  [ProductCategory.Makeup]: 'Makeup',
  [ProductCategory.NewArrivals]: 'New Arrivals',
};

export const CATEGORY_OPTIONS = [
  { value: ProductCategory.SkinCare, label: CATEGORY_LABELS[ProductCategory.SkinCare] },
  { value: ProductCategory.Makeup, label: CATEGORY_LABELS[ProductCategory.Makeup] },
  {
    value: ProductCategory.NewArrivals,
    label: CATEGORY_LABELS[ProductCategory.NewArrivals],
  },
] as const;

export const DEFAULT_CATEGORY = CATEGORY_LABELS[ProductCategory.SkinCare];

export type ProductCategoryLabel = (typeof CATEGORY_OPTIONS)[number]['label'];

export const CATEGORY_SLUG_BY_LABEL: Record<ProductCategoryLabel, ProductCategory> = {
  'Skin Care': ProductCategory.SkinCare,
  Makeup: ProductCategory.Makeup,
  'New Arrivals': ProductCategory.NewArrivals,
};

export function getCategoryLabelBySlug(
  slug?: string | null
): ProductCategoryLabel | undefined {
  const matchedCategory = CATEGORY_OPTIONS.find((category) => category.value === slug);
  return matchedCategory?.label;
}
