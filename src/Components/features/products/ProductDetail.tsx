import { useState } from 'react';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { Link, useLoaderData } from 'react-router-dom';

import type { Product } from '@/types';

import { ROUTES } from '@/constants/routes';
import { addItem } from '@/components/features/cart/cartSlice';
import { productsList } from '@/components/services/data';
import { getProductById } from '@/components/services/helper';
import { formatCurrency } from '@/components/utils/helpers';
import { useAppDispatch } from '@store/hooks';

type ProductDetailLoaderData = {
  product: Product;
  relatedProducts: Product[];
};

function ProductDetail(): JSX.Element {
  const { product, relatedProducts } = useLoaderData() as ProductDetailLoaderData;
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);

  const productPrice = product.unitPrice ?? product.price;
  const isSoldOut = product.soldOut ?? !product.inStock;

  function handleAddToCart(): void {
    dispatch(
      addItem({
        productId: product.id,
        name: product.name,
        quantity,
        unitPrice: productPrice,
        totalPrice: productPrice * quantity,
        mainImage: product.mainImage ?? product.images.main,
      })
    );
  }

  return (
    <section>
      <nav aria-label="Breadcrumb">
        <Link to={ROUTES.HOME}>Home</Link>
        {' > '}
        <Link to={ROUTES.PRODUCTS}>Products</Link>
        {' > '}
        <span>{product.category}</span>
        {' > '}
        <span>{product.name}</span>
      </nav>

      <div>
        <div>
          <img
            src={product.mainImage ?? product.images.main}
            alt={product.name}
          />
        </div>

        <div>
          <p>{product.category}</p>
          <h1>{product.name}</h1>
          <p>{formatCurrency(productPrice)}</p>
          <p>{product.description}</p>
          <p>{isSoldOut ? 'Sold Out' : 'In Stock'}</p>

          {!isSoldOut && (
            <div>
              <div>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => current + 1)}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
              >
                Add {quantity} to cart
              </button>
            </div>
          )}
        </div>
      </div>

      <section>
        <div>
          <p>Related products</p>
          <p>More from {product.category}</p>
        </div>

        <div>
          {relatedProducts.map((relatedProduct) => {
            const relatedPrice = relatedProduct.unitPrice ?? relatedProduct.price;

            return (
              <Link
                key={relatedProduct.id}
                to={ROUTES.PRODUCT_DETAIL.replace(':id', String(relatedProduct.id))}
              >
                <div>
                  <img
                    src={relatedProduct.mainImage ?? relatedProduct.images.main}
                    alt={relatedProduct.name}
                  />
                  <p>{relatedProduct.name}</p>
                  <p>{formatCurrency(relatedPrice)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </section>
  );
}

export async function loader({
  params,
}: LoaderFunctionArgs): Promise<ProductDetailLoaderData> {
  const productId = params.id;

  if (!productId) {
    throw new Response('Product not found.', { status: 404 });
  }

  const product = await getProductById(productId);

  if (!product) {
    throw new Response('Product not found.', { status: 404 });
  }

  const relatedProducts = (productsList[product.category] ?? [])
    .filter((relatedProduct) => relatedProduct.id !== product.id)
    .slice(0, 4);

  return { product, relatedProducts };
}

export default ProductDetail;
