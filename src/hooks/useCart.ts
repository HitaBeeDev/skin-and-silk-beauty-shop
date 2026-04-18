import { useMemo } from "react";

import {
  addItem as addCartItem,
  clearCart as clearCartItems,
  decreaseItemQuantity,
  deleteItem,
  increaseItemQuantity,
} from "@/components/features/cart/cartSlice";
import { getCart } from "@/components/features/cart/cartSelectors";
import type { CartItem } from "@/types";
import { useAppDispatch, useAppSelector } from "@store/hooks";

type UseCartResult = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: CartItem["productId"]) => void;
  updateQuantity: (productId: CartItem["productId"], quantity: number) => void;
  clearCart: () => void;
  isEmpty: boolean;
};

export function useCart(): UseCartResult {
  const dispatch = useAppDispatch();
  const items = useAppSelector(getCart);

  const totalItems = useMemo(
    () => items.reduce<number>((sum, item) => sum + item.quantity, 0),
    [items],
  );
  const totalPrice = useMemo(
    () => items.reduce<number>((sum, item) => sum + item.totalPrice, 0),
    [items],
  );

  function addItem(item: CartItem): void {
    dispatch(addCartItem(item));
  }

  function removeItem(productId: CartItem["productId"]): void {
    dispatch(deleteItem(productId));
  }

  function updateQuantity(
    productId: CartItem["productId"],
    quantity: number,
  ): void {
    const nextQuantity = Math.max(0, Math.trunc(quantity));
    const existingItem = items.find((item) => item.productId === productId);

    if (!existingItem) return;

    if (nextQuantity === 0) {
      dispatch(deleteItem(productId));
      return;
    }

    const difference = nextQuantity - existingItem.quantity;

    if (difference > 0) {
      Array.from({ length: difference }).forEach(() => {
        dispatch(increaseItemQuantity(productId));
      });
      return;
    }

    Array.from({ length: Math.abs(difference) }).forEach(() => {
      dispatch(decreaseItemQuantity(productId));
    });
  }

  function clearCart(): void {
    dispatch(clearCartItems());
  }

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isEmpty: totalItems === 0,
  };
}

export default useCart;
