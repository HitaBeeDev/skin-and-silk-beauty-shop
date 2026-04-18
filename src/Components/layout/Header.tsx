import { type CSSProperties } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

import { getTotalCartQuantity } from '@/components/features/cart/cartSelectors';
import SearchOrder from '@/components/features/order/SearchOrder';
import shoppingBag from '@/assets/shoppingBag.svg';
import { useAppSelector } from '@store/hooks';

const activeNavStyle: CSSProperties = {
  fontWeight: 700,
  textDecoration: 'underline',
};

const inactiveNavStyle: CSSProperties = {
  fontWeight: 500,
  textDecoration: 'none',
};

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

        <NavLink
          style={({ isActive }) => (isActive ? activeNavStyle : inactiveNavStyle)}
          to={ROUTES.HOME}
        >
          Home
        </NavLink>

        <NavLink
          style={({ isActive }) => (isActive ? activeNavStyle : inactiveNavStyle)}
          to={ROUTES.PRODUCTS}
        >
          Products
        </NavLink>
      </div>

      <div>
        {totalCartQuantity > 0 ? (
          <NavLink
            style={({ isActive }) => (isActive ? activeNavStyle : inactiveNavStyle)}
            to={ROUTES.CART}
          >
            <img src={shoppingBag} alt="shopping bag" />
            <p
            >
              {totalCartQuantity}
            </p>
          </NavLink>
        ) : (
          <NavLink
            style={({ isActive }) => (isActive ? activeNavStyle : inactiveNavStyle)}
            to={ROUTES.PRODUCTS}
          >
            <button
            >
              Start Shopping
            </button>
          </NavLink>
        )}
      </div>

      <SearchOrder />
    </div>
  );
}

export default Header;
