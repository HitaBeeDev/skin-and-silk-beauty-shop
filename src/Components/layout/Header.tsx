import { Link, NavLink } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

import { getTotalCartQuantity } from '@/components/features/cart/cartSelectors';
import SearchOrder from '@/components/features/order/SearchOrder';
import shoppingBag from '@/assets/shoppingBag.svg';
import { useAppSelector } from '@store/hooks';

function navLinkClassName({ isActive }: { isActive: boolean }): string {
  return [
    'rounded-md px-2 py-1 text-sm text-[#5A4034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2',
    isActive ? 'font-bold underline' : 'font-medium no-underline',
  ].join(' ');
}

function Header(): JSX.Element {
  const totalCartQuantity = useAppSelector(getTotalCartQuantity);

  return (
    <header className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Link
          className="rounded-md px-2 py-1 font-semibold text-[#5A4034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
          to={ROUTES.HOME}
        >
          Skin & Silk
        </Link>

        <NavLink
          className={navLinkClassName}
          to={ROUTES.HOME}
        >
          Home
        </NavLink>

        <NavLink
          className={navLinkClassName}
          to={ROUTES.PRODUCTS}
        >
          Products
        </NavLink>
      </div>

      <div className="flex items-center gap-3">
        {totalCartQuantity > 0 ? (
          <NavLink
            aria-label={`Cart with ${totalCartQuantity} items`}
            className={({ isActive }) =>
              [
                'flex items-center gap-2 rounded-md px-2 py-1 text-[#5A4034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2',
                isActive ? 'font-bold underline' : 'font-medium no-underline',
              ].join(' ')
            }
            to={ROUTES.CART}
          >
            <img aria-hidden="true" className="h-5 w-5" src={shoppingBag} alt="" />
            <p>
              {totalCartQuantity}
            </p>
          </NavLink>
        ) : (
          <NavLink
            className={navLinkClassName}
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
    </header>
  );
}

export default Header;
