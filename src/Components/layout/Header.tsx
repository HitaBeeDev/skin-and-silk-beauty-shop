import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

import { getTotalCartQuantity } from '@/components/features/cart/cartSelectors';
import SearchOrder from '@/components/features/order/SearchOrder';
import Badge from '@/components/ui/Badge';
import shoppingBag from '@/assets/shoppingBag.svg';
import { useClickOutside } from '@/hooks';
import { useAppSelector } from '@store/hooks';

type NavLinkClassNameArgs = {
  isActive: boolean;
};

function navLinkClassName({ isActive }: NavLinkClassNameArgs): string {
  return [
    'header-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2',
    isActive ? 'header-link-active' : '',
  ].join(' ');
}

function Header(): JSX.Element {
  const totalCartQuantity = useAppSelector(getTotalCartQuantity);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBadgePulsing, setIsBadgePulsing] = useState(false);
  const previousCartQuantityRef = useRef<number | null>(null);
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);

  useClickOutside(
    mobilePanelRef,
    (event) => {
      const target = event.target as Node | null;

      if (mobileMenuButtonRef.current?.contains(target)) return;

      setIsMobileMenuOpen(false);
    },
    isMobileMenuOpen
  );

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    function handleScroll(): void {
      setIsScrolled(window.scrollY > 0);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (
      previousCartQuantityRef.current !== null &&
      previousCartQuantityRef.current !== totalCartQuantity &&
      totalCartQuantity > 0
    ) {
      setIsBadgePulsing(true);
      const timeoutId = window.setTimeout(() => setIsBadgePulsing(false), 200);

      previousCartQuantityRef.current = totalCartQuantity;

      return () => window.clearTimeout(timeoutId);
    }

    previousCartQuantityRef.current = totalCartQuantity;
    setIsBadgePulsing(false);
  }, [totalCartQuantity]);

  function renderNavLink(to: string, label: string): JSX.Element {
    return (
      <NavLink
        className={({ isActive }) => navLinkClassName({ isActive })}
        to={to}
      >
        {label}
      </NavLink>
    );
  }

  function renderCartLink(className = ''): JSX.Element {
    return (
      <NavLink
        aria-label={`Cart with ${totalCartQuantity} item${totalCartQuantity === 1 ? '' : 's'}`}
        className={({ isActive }) =>
          [
            className,
            'header-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2',
            isActive ? 'header-link-active' : '',
          ].join(' ')
        }
        to={ROUTES.CART}
      >
        <img aria-hidden="true" className="h-5 w-5" src={shoppingBag} alt="" />
        <span>Cart</span>
        <Badge
          className={totalCartQuantity > 0 ? 'header-badge' : 'header-badge hidden'}
          tone="accent"
        >
          <span data-pulse={isBadgePulsing ? 'true' : 'false'}>{totalCartQuantity}</span>
        </Badge>
      </NavLink>
    );
  }

  return (
    <header className="header-shell" data-scrolled={isScrolled ? 'true' : 'false'}>
      <div className="page-shell flex flex-col gap-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            className="inline-flex items-center gap-3 rounded-full px-1 py-1 text-[var(--color-espresso)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
            to={ROUTES.HOME}
          >
            <span
              aria-hidden="true"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-rosewater)] text-sm font-semibold uppercase tracking-[0.28em]"
            >
              SS
            </span>

            <span className="text-lg font-semibold text-[var(--color-espresso)]">
              Skin &amp; Silk
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-2 md:flex">
            {renderNavLink(ROUTES.PRODUCTS, 'Products')}
            {renderCartLink()}
          </nav>

          <button
            aria-controls="mobile-navigation"
            aria-expanded={isMobileMenuOpen}
            aria-label="Open menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/80 text-[var(--color-espresso)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 md:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            ref={mobileMenuButtonRef}
            type="button"
          >
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.8"
              />
            </svg>
          </button>
        </div>

        <SearchOrder />
      </div>

      <div
        aria-hidden={isMobileMenuOpen ? 'false' : 'true'}
        className="mobile-nav-backdrop md:hidden"
        data-open={isMobileMenuOpen ? 'true' : 'false'}
      />

      <div
        aria-modal="true"
        aria-hidden={isMobileMenuOpen ? 'false' : 'true'}
        className={`fixed inset-0 z-[calc(var(--z-sticky)+1)] md:hidden ${isMobileMenuOpen ? '' : 'pointer-events-none'}`}
        id="mobile-navigation"
        role="dialog"
      >
        <div
          className="mobile-nav-panel flex flex-col gap-8 px-6 py-6"
          data-open={isMobileMenuOpen ? 'true' : 'false'}
          ref={mobilePanelRef}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-espresso)]">
              Menu
            </p>

            <button
              aria-label="Close menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/85 text-[var(--color-espresso)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
              onClick={() => setIsMobileMenuOpen(false)}
              type="button"
            >
              <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                />
              </svg>
            </button>
          </div>

          <nav aria-label="Mobile" className="flex flex-col gap-3">
            {renderNavLink(ROUTES.PRODUCTS, 'Products')}
            {renderCartLink('self-start')}
          </nav>
        </div>
      </div>

      <span aria-live="polite" className="sr-only">
        Cart now has {totalCartQuantity} item{totalCartQuantity === 1 ? '' : 's'}.
      </span>
    </header>
  );
}

export default Header;
