import { useState } from "react";
import { Link } from "react-router-dom";

import plus from "@/assets/plus.svg";

import type { Product as ProductModel } from "@/types";

import { ROUTES } from "@/constants/routes";

import { addItem } from "@/components/features/cart/cartSlice";
import { formatCurrency } from "@/components/utils/helpers";
import Badge from "@/components/ui/Badge";
import Toast from "@/components/ui/Toast";
import { useAppDispatch } from "@store/hooks";

type ProductProps = {
  product: ProductModel;
};

function Product({ product }: ProductProps): JSX.Element {
  const dispatch = useAppDispatch();
  const [isAddedToastOpen, setIsAddedToastOpen] = useState(false);
  const [toastKey, setToastKey] = useState(0);

  const {
    id,
    name,
    unitPrice,
    soldOut,
    mainImage,
    description,
    images,
    isNew,
  } = product;
  const productUnitPrice = unitPrice ?? product.price;
  const hoverImage = images.hover || mainImage;
  const hasHoverImage = Boolean(hoverImage && hoverImage !== mainImage);

  function handleAddToCart(): void {
    dispatch(
      addItem({
        productId: id,
        name,
        quantity: 1,
        unitPrice: productUnitPrice,
        totalPrice: productUnitPrice,
        mainImage,
      }),
    );
    setToastKey((current) => current + 1);
    setIsAddedToastOpen(true);
  }

  return (
    <>
      <div
        className="group relative flex h-full flex-col overflow-hidden rounded-[1.1rem] border
       border-[#8c1d40]/10 bg-white shadow-[0_18px_45px_rgba(85,0,0,0.08)] transition-transform duration-200 ease-in 
       hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(85,0,0,0.16)]"
      >
        {isNew ? (
          <div className="absolute top-3 left-3 z-20">
            <Badge tone="accent">New</Badge>
          </div>
        ) : null}

        <Link
          className="flex h-full flex-col no-underline"
          to={ROUTES.PRODUCT_DETAIL.replace(":id", String(id))}
        >
          <div className="flex h-full flex-col">
            <div className="relative overflow-hidden bg-[#fff0f2]">
              <div className="relative aspect-[4/5]">
                <img
                  className={[
                    "absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-300 ease-in",
                    hasHoverImage
                      ? "opacity-100 group-hover:opacity-0"
                      : "opacity-100",
                    "group-hover:scale-[1.04]",
                  ].join(" ")}
                  src={mainImage}
                  alt={`${name} product`}
                />
                {hasHoverImage ? (
                  <img
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-[transform,opacity] duration-300 ease-in group-hover:scale-[1.04] group-hover:opacity-100"
                    src={hoverImage}
                    alt=""
                    aria-hidden="true"
                  />
                ) : null}
                {soldOut ? (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-[rgba(255,247,248,0.8)]">
                    <span className="rounded-full border border-[#8c1d40]/15 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7a5a61]">
                      Sold Out
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 px-4 py-4 text-[#241915] sm:px-5 sm:py-5">
              <p className="font-['Playfair_Display',serif] text-[1.15rem] leading-tight text-[#3e0f1f] sm:text-xl">
                {name}
              </p>

              <p className="text-[0.88rem] leading-6 text-[#6c4a4e]">
                {description}
              </p>

              <div className="mt-auto pt-2">
                {!soldOut ? (
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8c1d40]">
                    {formatCurrency(productUnitPrice)}
                  </p>
                ) : (
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a5c4a]">
                    Sold out
                  </p>
                )}
              </div>
            </div>
          </div>
        </Link>

        {!soldOut && (
          <button
            aria-label={`Add ${name} to cart`}
            className="absolute right-4 bottom-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#8c1d40] bg-[#8c1d40] shadow-[0_14px_28px_rgba(140,29,64,0.2)] transition-all duration-200 ease-in hover:scale-105 hover:bg-[#a70a3f] active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8c1d40]/25"
            onClick={handleAddToCart}
            type="button"
          >
            <img className="h-4 w-4" src={plus} alt="" aria-hidden="true" />
          </button>
        )}

        {soldOut ? (
          <button
            aria-label={`${name} is sold out`}
            className="absolute right-4 bottom-4 inline-flex h-10 min-w-[7rem] cursor-not-allowed items-center justify-center rounded-full border border-[#8c1d40]/15 bg-[#fff0f2] px-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8d6a5c] opacity-90"
            disabled
            type="button"
          >
            Sold Out
          </button>
        ) : null}
      </div>

      <Toast
        key={toastKey}
        duration={2000}
        isOpen={isAddedToastOpen}
        message={`${name} added to cart.`}
        onClose={() => setIsAddedToastOpen(false)}
        position="top-right"
        tone="success"
      />
    </>
  );
}

export default Product;
