import type { LoaderFunctionArgs } from 'react-router-dom';

import type { Product } from '@/types';

import { getProductById, getProducts } from '@/services/productsService';

export type ProductDetailLoaderData = {
  product: Product;
  relatedProducts: Product[];
};

export async function loader({
  params,
}: LoaderFunctionArgs): Promise<ProductDetailLoaderData> {
  const productId = params.id;

  if (!productId) {
    throw new Response('Product not found.', { status: 404 });
  }

  try {
    const product = await getProductById(productId);
    const relatedProductsResponse = await getProducts({ category: product.category });
    const relatedProducts = relatedProductsResponse.data
      .filter((relatedProduct) => relatedProduct.id !== product.id)
      .slice(0, 4);

    return { product, relatedProducts };
  } catch {
    throw new Response('Product not found.', { status: 404 });
  }
}
