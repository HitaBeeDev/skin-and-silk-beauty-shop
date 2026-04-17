import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import CartItem from '@/components/features/cart/CartItem';
import EmptyCart from '@/components/features/cart/EmptyCart';
import { clearCart, getCart } from '@/components/features/cart/cartSlice';

function Cart(): JSX.Element {
  const cart = useAppSelector(getCart);
  const dispatch = useAppDispatch();

  if (!cart.length) return <EmptyCart />;

  return (
    <div>
      <p>
        Your Shopping Basket
      </p>

      <div>
          <ul>
          {cart.map((product) => (
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
