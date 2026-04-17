import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

import { getTotalCartQuantity } from '@/components/features/cart/cartSelectors';
import shoppingBag from '@/assets/shoppingBag.svg';
import { useAppSelector } from '@store/hooks';

function Header(): JSX.Element {
  const totalCartQuantity = useAppSelector(getTotalCartQuantity);

  return (
    <div>
      <div>
        <Link
          to={ROUTES.HOME}
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
          <Link to={ROUTES.CART}>
            <img src={shoppingBag} alt="shopping bag" />
            <p
            >
              {totalCartQuantity}
            </p>
          </Link>
        ) : (
          <Link to={ROUTES.PRODUCTS}>
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
