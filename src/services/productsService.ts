import productsResponse from '@/services/mockData/products.json';

import type { ApiResponse, Product } from '@/types';

type ProductFilters = {
  category?: string;
};

type RawProduct = (typeof productsResponse.data)[number];

const productAssetUrls = import.meta.glob('../assets/Products/*', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

function resolveAsset(filename: string): string {
  return productAssetUrls[`../assets/Products/${filename}`] ?? filename;
}

function hydrateProduct(product: RawProduct): Product {
  return {
    ...product,
    images: {
      main: resolveAsset(product.images.main),
      hover: resolveAsset(product.images.hover),
      gallery: product.images.gallery.map(resolveAsset),
    },
    unitPrice: product.price,
    soldOut: !product.inStock,
    mainImage: resolveAsset(product.images.main),
  };
}

/** Simulates `GET /api/products`. */
export async function getProducts(
  filters?: ProductFilters
): Promise<ApiResponse<Product[]>> {
  const products = productsResponse.data
    .filter((product) =>
      filters?.category ? product.category === filters.category : true
    )
    .map(hydrateProduct);

  return Promise.resolve({
    data: products,
    meta: {
      total: products.length,
    },
  });
}

/** Simulates `GET /api/products/:id`. */
export async function getProductById(id: string): Promise<Product> {
  const product = productsResponse.data.find((item) => item.id === id);

  if (!product) {
    throw new Error(`Product ${id} not found`);
  }

  return Promise.resolve(hydrateProduct(product));
}
