import { useState } from 'react';
import { Link } from 'react-router-dom';

import plus from '@/assets/plus.svg';

import type { Product as ProductModel } from '@/types';

import { ROUTES } from '@/constants/routes';

import { addItem } from '@/components/features/cart/cartSlice';
import Toast from '@/components/ui/Toast';
import { useAppDispatch } from '@store/hooks';

type ProductProps = {
  product: ProductModel;
};

function Product({ product }: ProductProps): JSX.Element {
  const dispatch = useAppDispatch();
  const [isAddedToastOpen, setIsAddedToastOpen] = useState(false);
  const [toastKey, setToastKey] = useState(0);

  const { id, name, unitPrice, soldOut, mainImage, description } = product;
  const productUnitPrice = unitPrice ?? product.price;

  function handleAddToCart(): void {
    dispatch(
      addItem({
        productId: id,
        name,
        quantity: 1,
        unitPrice: productUnitPrice,
        totalPrice: productUnitPrice,
        mainImage,
      })
    );
    setToastKey((current) => current + 1);
    setIsAddedToastOpen(true);
  }

  return (
    <>
      <div className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#ead9ca] bg-white shadow-[0_20px_45px_-34px_rgba(36,25,21,0.34)] transition-transform duration-200 ease-in hover:-translate-y-1 hover:shadow-[0_24px_60px_-32px_rgba(36,25,21,0.42)]">
        <Link
          className="flex h-full flex-col no-underline"
          to={ROUTES.PRODUCT_DETAIL.replace(':id', String(id))}
        >
          <div className="flex h-full flex-col">
            <div className="overflow-hidden bg-[#fbf3ec]">
              <div className="aspect-[4/5]">
                <img
                  className="h-full w-full object-cover transition-transform duration-300 ease-in group-hover:scale-[1.03]"
                  src={mainImage}
                  alt={`${name} product`}
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 px-5 py-5 text-[#241915]">
              <p className="font-['Playfair_Display',serif] text-xl leading-tight text-[#5a4034]">
                {name}
              </p>

              <p className="text-sm leading-6 text-[#5b463d]">
                {description}
              </p>

              <div className="mt-auto pt-2">
                {!soldOut ? (
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5a4034]">
                    €{productUnitPrice.toFixed(2)}
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
            className="absolute right-4 bottom-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#5a4034] bg-[#5a4034] shadow-lg transition-all duration-200 ease-in hover:scale-105 hover:opacity-90 active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
            onClick={handleAddToCart}
            type="button"
          >
            <img className="h-4 w-4" src={plus} alt="" aria-hidden="true" />
          </button>
        )}
      </div>

      <Toast
        key={toastKey}
        duration={2000}
        message={`${name} added to cart.`}
        onClose={() => setIsAddedToastOpen(false)}
        open={isAddedToastOpen}
        position="top-right"
        tone="success"
      />
    </>
  );
}

export default Product;
