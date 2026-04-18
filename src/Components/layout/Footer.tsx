import { Link } from "react-router-dom";

import { ROUTES } from "@/constants/routes";

function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();
  const footerLinkClass = [
    "w-fit text-[#6b5145] no-underline transition-colors duration-150 ease-in",
    "hover:text-[#5a4034]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2",
  ].join(" ");

  return (
    <footer
      className="mt-20 border-t border-[#5a403429] bg-[linear-gradient(180deg,rgba(255,250,245,0.96),rgba(255,244,236,0.96))] py-14"
      id="contact"
    >
      <div className="mx-auto grid w-[min(100%-2rem,72rem)] gap-8 md:grid-cols-[minmax(0,1.6fr)_minmax(0,0.7fr)_minmax(0,1fr)] md:items-start">
        <div className="flex flex-col gap-3">
          <Link
            className="inline-flex items-center gap-3 rounded-full px-1 py-1 text-[#5a4034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
            to={ROUTES.HOME}
          >
            <span
              aria-hidden="true"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#5a403429] bg-[#f6e6da] text-sm font-semibold uppercase tracking-[0.28em]"
            >
              SS
            </span>
            <span className="text-lg font-semibold text-[#5a4034]">
              Skin &amp; Silk
            </span>
          </Link>

          <p className="max-w-md text-sm leading-6 text-[#4b3831]">
            Luxury beauty, skincare, and wellness essentials with a refined,
            editorial shopping flow.
          </p>

          <p className="text-sm leading-6 text-[#4b3831]">
            Portfolio project — not a real store.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-3">
          <Link className={footerLinkClass} to={ROUTES.PRODUCTS}>
            Products
          </Link>
          <Link className={footerLinkClass} to={ROUTES.CART}>
            Cart
          </Link>
          <Link className={footerLinkClass} to={`${ROUTES.HOME}#order-search`}>
            Orders
          </Link>
        </nav>

        <div className="flex flex-col gap-3 text-sm leading-6 text-[#4b3831]">
          <p>Contact: concierge@skinandsilk.com</p>
          <a
            className={footerLinkClass}
            href="https://github.com/HitaBeeDev/Elan-Beauty"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub Repository
          </a>
          <p>&copy; {currentYear} Skin &amp; Silk</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
