import { useEffect, useRef, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import { useClickOutside } from "@/hooks";
import { useDebounce } from "@/hooks";

function Header(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
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
    <header className="sticky top-0 z-[60] bg-white/90 backdrop-blur-xl rounded-full">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center pl-6 pr-6 pt-3 pb-3">
        <div className="justify-self-start">
          <Link
            className="cursor-pointer font-['Cormorant_Garamond',serif] text-[#550000] text-[1.25rem] font-[500]"
            to={ROUTES.HOME}
          >
            S & S
          </Link>
        </div>

        <div className="flex flex-row items-center justify-center gap-10 justify-self-center">
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

        <div className="flex flex-row items-center justify-center gap-3 justify-self-end">
          <form onSubmit={handleSearchSubmit}>
            <label className="flex h-9 w-[12rem] items-center gap-2 rounded-full bg-[#fff0f0] px-3">
              <FontAwesomeIcon
                className="text-[0.8rem] text-[#ae0606]"
                icon={faMagnifyingGlass}
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
            className="flex h-[1.9rem] w-[1.9rem] items-center justify-center rounded-full bg-[#550000] p-[0.45rem] 
          hover:bg-[#900c0c] transition-all duration-300 cursor-pointer"
            to={ROUTES.CART}
          >
            <ShoppingCart className="text-white" strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
