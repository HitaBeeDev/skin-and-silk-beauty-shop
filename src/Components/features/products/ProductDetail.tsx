import { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { CATEGORY_SLUG_BY_LABEL } from '@/constants/categories';
import { addItem } from '@/components/features/cart/cartSlice';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { formatCurrency } from '@/components/utils/helpers';
import type { ProductDetailLoaderData } from '@/routes/productDetail.loader';
import { useAppDispatch } from '@store/hooks';

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
      <Breadcrumb
        items={[
          { label: 'Home', to: ROUTES.HOME },
          { label: 'Products', to: ROUTES.PRODUCTS },
          {
            label: product.category,
            to: `${ROUTES.PRODUCTS}?category=${CATEGORY_SLUG_BY_LABEL[product.category]}`,
          },
          { label: product.name },
        ]}
      />

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

export default ProductDetail;
