import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { CartItem } from '@/types';
import type { RootState } from '@store';

type CartState = {
  cart: CartItem[];
};

const initialState: CartState = {
  cart: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const existingItem = state.cart.find(
        (item) => item.productId === action.payload.productId
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
        return;
      }

      state.cart.push(action.payload);
    },
    deleteItem(state, action: PayloadAction<CartItem['productId']>) {
      state.cart = state.cart.filter(
        (item) => item.productId !== action.payload
      );
    },
    increaseItemQuantity(state, action: PayloadAction<CartItem['productId']>) {
      const item = state.cart.find((item) => item.productId === action.payload);
      if (!item) return;
      item.quantity++;
      item.totalPrice = item.quantity * item.unitPrice;
    },
    decreaseItemQuantity(state, action: PayloadAction<CartItem['productId']>) {
      const item = state.cart.find((item) => item.productId === action.payload);
      if (!item) return;
      item.quantity--;
      item.totalPrice = item.quantity * item.unitPrice;
      if (item.quantity === 0) cartSlice.caseReducers.deleteItem(state, action);
    },
    clearCart(state) {
      state.cart = [];
    },
  },
});

export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const getCart = (state: RootState): CartItem[] => state.cart.cart;

export const getTotalCartQuantity = (state: RootState): number =>
  state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);

export const getTotalCartPrice = (state: RootState): number =>
  state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0);

export const getCurrentQuantityById =
  (id: CartItem['productId']) =>
  (state: RootState): number =>
    state.cart.cart.find((item) => item.productId === id)?.quantity ?? 0;
