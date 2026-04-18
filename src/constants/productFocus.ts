import type { Product } from "@/types";

export const PRODUCT_FOCUS_OPTIONS = ["face", "eyes", "lips"] as const;

export type ProductFocus = (typeof PRODUCT_FOCUS_OPTIONS)[number];

export const PRODUCT_FOCUS_LABELS: Record<ProductFocus, string> = {
  face: "Face",
  eyes: "Eyes",
  lips: "Lips",
};

const EYE_KEYWORDS = [
  "eye",
  "eyes",
  "eyelid",
  "eyeshadow",
  "under-eye",
  "mascara",
  "lash",
  "lashes",
  "brow",
  "brows",
] as const;

const LIP_KEYWORDS = [
  "lip",
  "lips",
  "lipstick",
  "balm",
  "gloss",
  "rouge",
  "volumizer",
] as const;

function buildProductSearchText(product: Product): string {
  return [
    product.name,
    product.slug,
    product.category,
    product.description,
    product.tags.join(" "),
    product.details?.subtitle,
    product.details?.overview,
    product.details?.mainBenefits?.join(" "),
    product.details?.additionalBenefits?.join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function includesAnyKeyword(text: string, keywords: readonly string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

export function getProductFocusFromSearchParam(
  value?: string | null,
): ProductFocus | undefined {
  return PRODUCT_FOCUS_OPTIONS.find((option) => option === value);
}

export function matchesProductFocus(
  product: Product,
  focus?: ProductFocus,
): boolean {
  if (!focus) return true;

  const searchText = buildProductSearchText(product);
  const isEyeProduct = includesAnyKeyword(searchText, EYE_KEYWORDS);
  const isLipProduct = includesAnyKeyword(searchText, LIP_KEYWORDS);

  switch (focus) {
    case "eyes":
      return isEyeProduct;
    case "lips":
      return isLipProduct;
    case "face":
      return !isEyeProduct && !isLipProduct;
    default:
      return true;
  }
}
