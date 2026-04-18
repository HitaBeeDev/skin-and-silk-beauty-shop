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
            aria-label={`Cart with ${totalCartQuantity} items`}
            style={({ isActive }) => (isActive ? activeNavStyle : inactiveNavStyle)}
            to={ROUTES.CART}
          >
            <img aria-hidden="true" src={shoppingBag} alt="" />
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
            Start Shopping
          </NavLink>
        )}
      </div>

      <span aria-live="polite" className="sr-only">
        Cart now has {totalCartQuantity} item{totalCartQuantity === 1 ? '' : 's'}.
      </span>

      <SearchOrder />
    </div>
  );
}

export default Header;
