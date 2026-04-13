import { Link } from 'react-router-dom';

import { getTotalCartQuantity } from '@/Components/features/cart/cartSlice';
import shoppingBag from '@/assets/shoppingBag.svg';
import { useAppSelector } from '@/store/hooks';

function Header(): JSX.Element {
  const totalCartQuantity = useAppSelector(getTotalCartQuantity);

  return (
    <div>
      <div>
        <Link
          to="/"
        >
          Skin & Silk
        </Link>

        <p
        >
          Our Story
        </p>

        <p
        >
          Our Products
        </p>

        <p
        >
          Customer Reviews
        </p>
      </div>

      <div>
        {totalCartQuantity > 0 ? (
          <Link to="/cart">
            <img src={shoppingBag} alt="shopping bag" />
            <p
            >
              {totalCartQuantity}
            </p>
          </Link>
        ) : (
          <Link to="/products-list">
            <button
            >
              Start Shopping
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;
