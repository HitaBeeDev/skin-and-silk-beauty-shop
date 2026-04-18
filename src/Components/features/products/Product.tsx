import { useState } from 'react';
import { Link } from 'react-router-dom';

import plus from '@/assets/plus.svg';

import type { Product as ProductModel } from '@/types';

import { ROUTES } from '@/constants/routes';

import { addItem } from '@/components/features/cart/cartSlice';
import Toast from '@/components/ui/Toast';
import { useAppDispatch } from '@store/hooks';

type ProductProps = {
  product: ProductModel;
};

function Product({ product }: ProductProps): JSX.Element {
  const dispatch = useAppDispatch();
  const [isAddedToastOpen, setIsAddedToastOpen] = useState(false);
  const [toastKey, setToastKey] = useState(0);

  const { id, name, unitPrice, soldOut, mainImage, description } = product;
  const productUnitPrice = unitPrice ?? product.price;

  function handleAddToCart(): void {
    dispatch(
      addItem({
        productId: id,
        name,
        quantity: 1,
        unitPrice: productUnitPrice,
        totalPrice: productUnitPrice,
        mainImage,
      })
    );
    setToastKey((current) => current + 1);
    setIsAddedToastOpen(true);
  }

  return (
    <>
      <Link to={ROUTES.PRODUCT_DETAIL.replace(':id', String(id))}>
        <div>
          <div>
            <div>
              <img
                src={mainImage}
                alt={name}
              />
            </div>
          </div>

          <div>
            <p>
              {name}
            </p>

            <p>
              {description}
            </p>

            <div>
              {!soldOut ? (
                <p>
                  €{productUnitPrice.toFixed(2)}
                </p>
              ) : (
                <p>
                  Sold out
                </p>
              )}

              {!soldOut && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleAddToCart();
                  }}
                >
                  <img src={plus} alt="plus" />
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      <Toast
        key={toastKey}
        duration={2000}
        message={`${name} added to cart.`}
        onClose={() => setIsAddedToastOpen(false)}
        open={isAddedToastOpen}
        position="top-right"
        tone="success"
      />
    </>
  );
}

export default Product;
