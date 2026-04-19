import { memo } from "react";

import type { CartItem as CartItemModel } from "@/types";

import DeleteItem from "@/components/features/cart/DeleteItem";
import UpdateItemQuantity from "@/components/features/cart/UpdateItemQuantity";
import { getCartItemById } from "@/components/features/cart/cartSelectors";
import { formatCurrency } from "@/components/utils/helpers";
import { useAppSelector } from "@store/hooks";

type CartItemProps = {
  product: CartItemModel;
  onRemove: (product: CartItemModel) => void;
};

function CartItem({ product, onRemove }: CartItemProps): JSX.Element {
  const { productId, name, unitPrice, mainImage } = product;
  const currentQuantity =
    useAppSelector(getCartItemById(productId))?.quantity ?? 0;

  return (
    <div className="grid gap-4 border-b border-[#550000]/10 px-4 py-5 transition-colors duration-150 ease-in last:border-b-0 hover:bg-[#fff8f8] sm:grid-cols-[auto_minmax(0,1.4fr)_auto_auto] sm:items-center sm:gap-6">
      <div className="overflow-hidden rounded-[1rem] bg-[#fff0f2] shadow-[0_8px_20px_rgba(85,0,0,0.07)]">
        <img
          alt={`${name} thumbnail`}
          className="h-24 w-20 object-cover"
          loading="lazy"
          src={mainImage}
        />
      </div>

      <div className="min-w-0">
        <p className="font-['Playfair_Display',serif] text-xl leading-tight text-[#550000]">
          {name}
        </p>
        <p className="mt-2 text-sm text-[#8c1d40]">
          {formatCurrency(unitPrice)} each
        </p>
      </div>

      <div className="flex items-center gap-3">
        <UpdateItemQuantity
          productId={productId}
          currentQuantity={currentQuantity}
          productName={name}
          onRemove={() => onRemove(product)}
        />
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:min-w-[11rem]">
        <p className="text-right text-base font-semibold text-[#5c0120]">
          {formatCurrency(currentQuantity * unitPrice)}
        </p>
        <DeleteItem onRemove={() => onRemove(product)} product={product} />
      </div>
    </div>
  );
}

export default memo(CartItem);
