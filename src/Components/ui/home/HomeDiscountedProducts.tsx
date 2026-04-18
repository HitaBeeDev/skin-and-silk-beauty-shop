import { useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

import type { Product } from "@/types";

import { addItem } from "@/components/features/cart/cartSlice";
import { getCart } from "@/components/features/cart/cartSelectors";
import Toast from "@/components/ui/Toast";
import { ROUTES } from "@/constants/routes";
import { useAppDispatch, useAppSelector } from "@store/hooks";

type HomeDiscountedProductsProps = {
  products: Product[];
};

function HomeDiscountedProducts({
  products,
}: HomeDiscountedProductsProps): JSX.Element {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(getCart);
  const [isAddedToastOpen, setIsAddedToastOpen] = useState(false);
  const [toastKey, setToastKey] = useState(0);
  const [toastMessage, setToastMessage] = useState("");

  const cartQuantityByProductId = useMemo(
    () =>
      Object.fromEntries(
        cartItems.map((item) => [item.productId, item.quantity]),
      ) as Record<string, number>,
    [cartItems],
  );

  function handleAddToCart(product: Product): void {
    const productUnitPrice = product.unitPrice ?? product.price;

    dispatch(
      addItem({
        productId: product.id,
        name: product.name,
        quantity: 1,
        unitPrice: productUnitPrice,
        totalPrice: productUnitPrice,
        mainImage: product.mainImage ?? product.images.main,
      }),
    );
    setToastMessage(`${product.name} added to cart.`);
    setToastKey((current) => current + 1);
    setIsAddedToastOpen(true);
  }

  return (
    <>
      <div className="mt-10 rounded-[1.1rem] bg-[#fff0f2] p-10">
        <div className="flex flex-row items-start justify-between">
          <p className="font-['Playfair_Display',serif] text-[2rem] font-[400] text-black">
            Discounted Products
          </p>

          <Link
            className="flex h-[2.1rem] cursor-pointer flex-row items-center justify-center gap-3 rounded-full bg-[#a70a3f] pl-5 pr-5 text-[0.8rem]
            font-[300] text-white transition-all duration-300 hover:bg-[#c80842]"
            to={`${ROUTES.PRODUCTS}?category=all&sale=true`}
          >
            <p>See All</p>

            <ShoppingCart strokeWidth={1.6} className="h-[1.1rem] w-[1.1rem]" />
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => {
            const compareAtPrice = product.compareAtPrice ?? product.price;
            const discountPercent = Math.round(
              ((compareAtPrice - product.price) / compareAtPrice) * 100,
            );
            const quantityInCart = cartQuantityByProductId[product.id] ?? 0;

            return (
              <div
                key={product.id}
                className="relative flex h-[15rem] flex-col rounded-[1.1rem] bg-white p-4"
              >
                <div className="absolute top-4 right-4 flex h-[1.2rem] w-[3rem] items-center justify-center rounded-full bg-[#a70a3f]">
                  <p className="text-[0.8rem] font-[300] text-[#fff0f2]">
                    -{discountPercent}%
                  </p>
                </div>

                <div className="flex flex-1 items-center justify-center px-4 pt-2">
                  <img
                    src={product.mainImage ?? product.images.main}
                    alt={product.name}
                    className="max-h-[8rem] w-auto object-contain"
                  />
                </div>

                <div className="mt-auto flex flex-row items-center justify-between gap-3">
                  <div className="flex min-w-0 flex-col">
                    <p className="truncate text-[0.85rem] font-[500] text-black">
                      {product.name}
                    </p>

                    <p className="text-[0.9rem] font-[400]">
                      <span className="text-[0.7rem] text-black/30">
                        Price:
                      </span>{" "}
                      <span className="text-[0.7rem] font-[300] text-black/45 line-through">
                        ${compareAtPrice}
                      </span>{" "}
                      <span className="text-[0.9rem] font-[400]">
                        ${product.price}
                      </span>
                    </p>
                  </div>

                  <button
                    aria-label={`Add ${product.name} to cart`}
                    className="relative flex h-[1.7rem] w-[1.7rem] cursor-pointer items-center justify-center rounded-full bg-black p-[0.4rem]"
                    onClick={() => handleAddToCart(product)}
                    type="button"
                  >
                    {quantityInCart > 0 ? (
                      <span className="absolute -top-2 -right-2 flex h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-full bg-[#ec124f] px-1 text-[0.65rem] font-[500] leading-none text-white">
                        {quantityInCart}
                      </span>
                    ) : null}
                    <ShoppingCart strokeWidth={1.6} className="text-white" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Toast
        key={toastKey}
        duration={2000}
        isOpen={isAddedToastOpen}
        message={toastMessage}
        onClose={() => setIsAddedToastOpen(false)}
        position="top-right"
        tone="success"
      />
    </>
  );
}

export default HomeDiscountedProducts;
