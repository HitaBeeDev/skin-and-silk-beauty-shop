import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

import { getTotalCartQuantity } from '@/components/features/cart/cartSelectors';
import Badge from '@/components/ui/Badge';
import shoppingBag from '@/assets/shoppingBag.svg';
import { useClickOutside } from '@/hooks';
import { useAppSelector } from '@store/hooks';

type NavLinkClassNameArgs = {
  isActive: boolean;
};

const shellWidthClass = 'mx-auto w-[min(100%-2rem,72rem)]';
const brandTextClass = 'text-[#5a4034]';
const linkBaseClass = [
  'relative inline-flex items-center gap-2 rounded-full px-4 py-[0.55rem] text-[0.95rem] font-medium no-underline',
  'text-[#6b5145] transition-[color,background-color] duration-150 ease-in',
  'hover:text-[#5a4034]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2',
].join(' ');

function navLinkClassName({ isActive }: NavLinkClassNameArgs): string {
  return [
    linkBaseClass,
    isActive
      ? "font-bold text-[#5a4034] after:absolute after:right-4 after:bottom-[0.35rem] after:left-4 after:h-[2px] after:rounded-full after:bg-current after:content-['']"
      : '',
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
            linkBaseClass,
            isActive
              ? "font-bold text-[#5a4034] after:absolute after:right-4 after:bottom-[0.35rem] after:left-4 after:h-[2px] after:rounded-full after:bg-current after:content-['']"
              : '',
          ].join(' ')
        }
        to={ROUTES.CART}
      >
        <img aria-hidden="true" className="h-5 w-5" src={shoppingBag} alt="" />
        <span>Cart</span>
        <Badge
          className={totalCartQuantity > 0 ? 'min-w-[1.45rem]' : 'hidden min-w-[1.45rem]'}
          tone="accent"
        >
          <span
            className={`transition-transform duration-200 ease-in ${isBadgePulsing ? 'scale-[1.3]' : 'scale-100'}`}
          >
            {totalCartQuantity}
          </span>
        </Badge>
      </NavLink>
    );
  }

  return (
    <header
      className={[
        'sticky top-0 z-[60] border-b border-transparent bg-white/88 backdrop-blur-[18px]',
        'transition-[box-shadow,border-color,background-color] duration-200 ease-in',
        isScrolled ? 'border-[#5a403429] shadow-[0_18px_40px_-30px_rgba(36,25,21,0.12)]' : '',
      ].join(' ')}
    >
      <div className={`${shellWidthClass} flex flex-col gap-4 py-4`}>
        <div className="flex items-center justify-between gap-4">
          <Link
            className={`inline-flex items-center gap-3 rounded-full px-1 py-1 ${brandTextClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2`}
            to={ROUTES.HOME}
          >
            <span className={`text-lg font-semibold ${brandTextClass}`}>
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
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#5a403429] bg-white/80 text-[#5a4034] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 md:hidden`}
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

      </div>

      <div
        aria-hidden={isMobileMenuOpen ? 'false' : 'true'}
        className={[
          'fixed inset-0 bg-[rgba(36,25,21,0.48)] transition-opacity duration-200 ease-in md:hidden',
          isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      />

      <div
        aria-modal="true"
        aria-hidden={isMobileMenuOpen ? 'false' : 'true'}
        className={`fixed inset-0 z-[61] md:hidden ${isMobileMenuOpen ? '' : 'pointer-events-none'}`}
        id="mobile-navigation"
        role="dialog"
      >
        <div
          className={[
            'fixed inset-y-0 right-0 flex w-[min(100%,24rem)] flex-col gap-8 bg-[linear-gradient(180deg,rgba(255,250,245,0.98),rgba(255,244,236,0.98))] px-6 py-6 shadow-[-24px_0_48px_-32px_rgba(36,25,21,0.28)]',
            'transition-transform duration-200 ease-in',
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
          ].join(' ')}
          ref={mobilePanelRef}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#5a4034]">
              Menu
            </p>

            <button
              aria-label="Close menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#5a403429] bg-white/85 text-[#5a4034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
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
