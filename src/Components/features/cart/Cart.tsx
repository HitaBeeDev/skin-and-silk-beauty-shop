import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

import type { CartItem as CartItemModel } from '@/types';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import CartItem from '@/components/features/cart/CartItem';
import EmptyCart from '@/components/features/cart/EmptyCart';
import { clearCart } from '@/components/features/cart/cartSlice';
import { getCart, getIsCartEmpty } from '@/components/features/cart/cartSelectors';

function Cart(): JSX.Element {
  const cart = useAppSelector(getCart);
  const isCartEmpty = useAppSelector(getIsCartEmpty);
  const dispatch = useAppDispatch();

  if (isCartEmpty) return <EmptyCart />;

  return (
    <div>
      <p>
        Your Shopping Basket
      </p>

      <div>
          <ul>
          {cart.map((product: CartItemModel) => (
            <li
              key={product.productId}
            >
              <CartItem product={product} />
            </li>
          ))}
        </ul>

        <div>
          <div>
            <Link to={ROUTES.PRODUCTS}>
              <button
              >
                Return to Menu
              </button>
            </Link>
            <button
              onClick={() => dispatch(clearCart())}
            >
              Remove All Items
            </button>
          </div>

          <div>
            <div
            >
              <Link
                to={ROUTES.CREATE_ORDER}
              >
                Order
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
