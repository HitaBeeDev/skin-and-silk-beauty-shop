import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import CartItem from '@/Components/features/cart/CartItem';
import EmptyCart from '@/Components/features/cart/EmptyCart';
import { clearCart, getCart } from '@/Components/features/cart/cartSlice';

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
            <Link to="/products-list">
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
                to="/order/new"
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
