export enum ProductCategory {
  All = "all",
  SkinCare = "skin-care",
  Makeup = "makeup",
  BodyCare = "body-care",
  NewArrivals = "new-arrivals",
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  [ProductCategory.All]: "All",
  [ProductCategory.SkinCare]: "Skin Care",
  [ProductCategory.Makeup]: "Makeup",
  [ProductCategory.BodyCare]: "Body Care",
  [ProductCategory.NewArrivals]: "New Arrivals",
};

export const CATEGORY_OPTIONS = [
  { value: ProductCategory.All, label: CATEGORY_LABELS[ProductCategory.All] },
  {
    value: ProductCategory.SkinCare,
    label: CATEGORY_LABELS[ProductCategory.SkinCare],
  },
  {
    value: ProductCategory.Makeup,
    label: CATEGORY_LABELS[ProductCategory.Makeup],
  },
  {
    value: ProductCategory.BodyCare,
    label: CATEGORY_LABELS[ProductCategory.BodyCare],
  },
] as const;

export const DEFAULT_CATEGORY = CATEGORY_LABELS[ProductCategory.All];

export type ProductCategoryLabel = (typeof CATEGORY_OPTIONS)[number]["label"];

export const CATEGORY_SLUG_BY_LABEL: Record<
  ProductCategoryLabel,
  ProductCategory
> = Object.fromEntries(
  CATEGORY_OPTIONS.map(({ label, value }) => [label, value]),
) as Record<ProductCategoryLabel, ProductCategory>;

export function getCategoryLabelBySlug(
  slug?: string | null,
): ProductCategoryLabel | undefined {
  const matchedCategory = CATEGORY_OPTIONS.find(
    (category) => category.value === slug,
  );
  return matchedCategory?.label;
}
