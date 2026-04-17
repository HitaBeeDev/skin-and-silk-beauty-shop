import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { CartItem, LoadingStatus } from '@/types';

type CartState = {
  items: CartItem[];
  status: LoadingStatus;
  error: string | null;
};

export const initialCartState: CartState = {
  items: [],
  status: 'idle',
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialCartState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
        return;
      }

      state.items.push(action.payload);
      state.status = 'succeeded';
    },
    deleteItem(state, action: PayloadAction<CartItem['productId']>) {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
      state.status = 'succeeded';
    },
    increaseItemQuantity(state, action: PayloadAction<CartItem['productId']>) {
      const item = state.items.find((item) => item.productId === action.payload);
      if (!item) return;
      item.quantity++;
      item.totalPrice = item.quantity * item.unitPrice;
      state.status = 'succeeded';
    },
    decreaseItemQuantity(state, action: PayloadAction<CartItem['productId']>) {
      const item = state.items.find((item) => item.productId === action.payload);
      if (!item) return;
      item.quantity--;
      item.totalPrice = item.quantity * item.unitPrice;
      if (item.quantity === 0) cartSlice.caseReducers.deleteItem(state, action);
      state.status = 'succeeded';
    },
    clearCart(state) {
      state.items = [];
      state.status = 'succeeded';
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
