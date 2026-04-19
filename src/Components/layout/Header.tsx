import { useEffect, useRef, useState } from "react";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { getTotalCartQuantity } from "@/components/features/cart/cartSelectors";
import { ROUTES } from "@/constants/routes";
import { useClickOutside } from "@/hooks";
import { useDebounce } from "@/hooks";
import { useAppSelector } from "@store/hooks";

function Header(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const totalCartQuantity = useAppSelector(getTotalCartQuantity);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 350);
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const isHomeActive = location.pathname === ROUTES.HOME;
  const isProductsActive = location.pathname.startsWith(ROUTES.PRODUCTS);
  const isSaleActive =
    location.pathname.startsWith(ROUTES.PRODUCTS) &&
    new URLSearchParams(location.search).get("sale") === "true";

  useClickOutside(
    mobilePanelRef,
    (event) => {
      const target = event.target as Node | null;

      if (mobileMenuButtonRef.current?.contains(target)) return;

      setIsMobileMenuOpen(false);
    },
    isMobileMenuOpen,
  );

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    const nextSearchValue = new URLSearchParams(location.search).get("q") ?? "";
    setSearchValue(nextSearchValue);
  }, [location.search]);

  useEffect(() => {
    const currentSearchParams = new URLSearchParams(location.search);
    const currentQuery = currentSearchParams.get("q") ?? "";
    const trimmedDebouncedValue = debouncedSearchValue.trim();

    if (trimmedDebouncedValue === currentQuery) return;

    const nextSearchParams = new URLSearchParams(location.search);
    nextSearchParams.set("category", "all");

    if (trimmedDebouncedValue) {
      nextSearchParams.set("q", trimmedDebouncedValue);
    } else {
      nextSearchParams.delete("q");
    }

    navigate(`${ROUTES.PRODUCTS}?${nextSearchParams.toString()}`, {
      replace: true,
    });
  }, [debouncedSearchValue, location.search, navigate]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const nextSearchParams = new URLSearchParams(location.search);
    nextSearchParams.set("category", "all");

    const trimmedSearchValue = searchValue.trim();

    if (trimmedSearchValue) {
      nextSearchParams.set("q", trimmedSearchValue);
    }

    navigate(`${ROUTES.PRODUCTS}?${nextSearchParams.toString()}`);
  }

  return (
    <header className="sticky top-0 z-[60] px-3 sm:px-4">
      <div className="rounded-[1.75rem] bg-white/10 backdrop-blur-3xl">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 sm:px-6 md:grid-cols-[1fr_auto_1fr]">
          <div className="justify-self-start">
            <Link
              className="cursor-pointer font-['Cormorant_Garamond',serif] text-[#550000] text-[1.25rem] font-[500]"
              to={ROUTES.HOME}
            >
              S & S
            </Link>
          </div>

          <div className="hidden flex-row items-center justify-center gap-6 justify-self-center md:flex lg:gap-10">
            <Link
              className={`cursor-pointer text-[0.9rem] font-[400] ${isHomeActive ? "text-[#900c0c]" : "text-[#550000]"}`}
              to={ROUTES.HOME}
            >
              Home
            </Link>

            <Link
              className={`cursor-pointer text-[0.9rem] font-[400] ${isProductsActive ? "text-[#900c0c]" : "text-[#550000]"}`}
              to={ROUTES.PRODUCTS}
            >
              Products
            </Link>

            <Link
              className="cursor-pointer text-[0.9rem] font-[400] text-[#550000]"
              to={`${ROUTES.HOME}#brand-story`}
            >
              Blog
            </Link>

            <Link
              className={`cursor-pointer text-[0.9rem] font-[400] ${isSaleActive ? "text-[#900c0c]" : "text-[#550000]"}`}
              to={`${ROUTES.PRODUCTS}?category=all&sale=true`}
            >
              Sale
            </Link>
          </div>

          <div className="hidden flex-row items-center justify-center gap-3 justify-self-end md:flex">
            <form
              className="max-w-[12rem] lg:max-w-none"
              onSubmit={handleSearchSubmit}
            >
              <label className="flex h-9 w-full min-w-0 items-center gap-2 rounded-full bg-[#fff0f0] px-3 lg:w-[12rem]">
                <Search
                  className="shrink-0 text-[#ae0606]"
                  size={14}
                  strokeWidth={2}
                />

                <input
                  className="w-full bg-transparent text-[0.82rem] text-[#550000] outline-none placeholder:text-[0.72rem] placeholder:text-[#ae0606]"
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search"
                  type="search"
                  value={searchValue}
                />
              </label>
            </form>

            <Link
              aria-label="Open cart"
              className="relative flex h-[1.9rem] w-[1.9rem] items-center justify-center rounded-full bg-[#550000] p-[0.45rem] 
          hover:bg-[#900c0c] transition-all duration-300 cursor-pointer"
              to={ROUTES.CART}
            >
              {totalCartQuantity > 0 ? (
                <span
                  className="absolute -top-1 -right-1 flex h-[1rem] min-w-[1rem] items-center justify-center rounded-full 
                bg-[#ec124f] px-1 text-[0.62rem] font-[500] leading-none text-white"
                >
                  {totalCartQuantity}
                </span>
              ) : null}
              <ShoppingCart className="text-white" strokeWidth={1.8} />
            </Link>
          </div>

          <div className="flex items-center gap-2 justify-self-end md:hidden">
            <Link
              aria-label="Open cart"
              className="relative flex h-[2.25rem] w-[2.25rem] items-center justify-center rounded-full bg-[#550000] p-[0.5rem] transition-all duration-300 cursor-pointer hover:bg-[#900c0c]"
              to={ROUTES.CART}
            >
              {totalCartQuantity > 0 ? (
                <span className="absolute -top-1.5 -right-1.5 flex h-[1rem] min-w-[1rem] items-center justify-center rounded-full bg-[#ec124f] px-1 text-[0.62rem] font-[500] leading-none text-white">
                  {totalCartQuantity}
                </span>
              ) : null}
              <ShoppingCart className="text-white" strokeWidth={1.8} />
            </Link>

            <button
              aria-controls="mobile-navigation"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              className="flex h-[2.25rem] w-[2.25rem] items-center justify-center rounded-full bg-[#fff0f0] text-[#550000] transition-colors duration-300 hover:bg-[#ffe4e4]"
              onClick={() =>
                setIsMobileMenuOpen((currentValue) => !currentValue)
              }
              ref={mobileMenuButtonRef}
              type="button"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <div
          aria-hidden={!isMobileMenuOpen}
          className={`overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out md:hidden ${
            isMobileMenuOpen
              ? "max-h-[32rem] translate-y-0 opacity-100"
              : "pointer-events-none max-h-0 -translate-y-2 opacity-0"
          }`}
          id="mobile-navigation"
        >
          <div
            className="mt-3 rounded-[1.75rem] bg-white px-4 py-4 shadow-[0_20px_60px_rgba(85,0,0,0.08)]"
            ref={mobilePanelRef}
          >
            <form onSubmit={handleSearchSubmit}>
              <label className="flex h-11 w-full items-center gap-2 rounded-full bg-[#fff0f0] px-4">
                <Search
                  className="shrink-0 text-[#ae0606]"
                  size={14}
                  strokeWidth={2}
                />
                <input
                  className="w-full bg-transparent text-[0.9rem] text-[#550000] outline-none placeholder:text-[0.78rem] placeholder:text-[#ae0606]"
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search"
                  type="search"
                  value={searchValue}
                />
              </label>
            </form>

            <nav className="mt-4 flex flex-col gap-2">
              <Link
                className={`rounded-full px-4 py-3 text-[0.95rem] font-[400] ${isHomeActive ? "bg-[#fff0f0] text-[#900c0c]" : "text-[#550000]"}`}
                to={ROUTES.HOME}
              >
                Home
              </Link>

              <Link
                className={`rounded-full px-4 py-3 text-[0.95rem] font-[400] ${isProductsActive ? "bg-[#fff0f0] text-[#900c0c]" : "text-[#550000]"}`}
                to={ROUTES.PRODUCTS}
              >
                Products
              </Link>

              <Link
                className="rounded-full px-4 py-3 text-[0.95rem] font-[400] text-[#550000]"
                to={`${ROUTES.HOME}#brand-story`}
              >
                Blog
              </Link>

              <Link
                className={`rounded-full px-4 py-3 text-[0.95rem] font-[400] ${isSaleActive ? "bg-[#fff0f0] text-[#900c0c]" : "text-[#550000]"}`}
                to={`${ROUTES.PRODUCTS}?category=all&sale=true`}
              >
                Sale
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
