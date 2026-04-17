import plus from '@/assets/plus.svg';

import type { Product as ProductModel } from '@/types';

import { addItem } from '@/components/features/cart/cartSlice';
import { productsList } from '@/components/services/data';
import { useAppDispatch } from '@store/hooks';

type ProductProps = {
  productId: ProductModel['id'];
};

function Product({ productId }: ProductProps): JSX.Element | null {
  const dispatch = useAppDispatch();

  const allProducts = Object.values(productsList).flat();
  const product = allProducts.find((p) => p.id === productId);

  if (!product) return null;

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
  }

  return (
    <>
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
                  handleAddToCart();
                }}
              >
                <img src={plus} alt="plus" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Product;
