import { createSelector } from '@reduxjs/toolkit';

import type { CartItem } from '@/types';
import type { RootState } from '@store';

const selectCartState = (state: RootState) => state.cart;

export const getCart = createSelector(
  [selectCartState],
  (cartState) => cartState.items
);

export const getCartStatus = createSelector(
  [selectCartState],
  (cartState) => cartState.status
);

export const getCartError = createSelector(
  [selectCartState],
  (cartState) => cartState.error
);

export const getTotalCartQuantity = createSelector([getCart], (items) =>
  items.reduce<number>((sum, item) => sum + item.quantity, 0)
);

export const getTotalCartPrice = createSelector([getCart], (items) =>
  items.reduce<number>((sum, item) => sum + item.totalPrice, 0)
);

export const getCartItemById =
  (productId: CartItem['productId']) =>
    createSelector([getCart], (items) =>
      items.find((item) => item.productId === productId)
    );

export const getIsCartEmpty = createSelector(
  [getTotalCartQuantity],
  (totalQuantity) => totalQuantity === 0
);
