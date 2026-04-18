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
      state.error = null;
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
      state.error = null;
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
      state.status = 'succeeded';
    },
    increaseItemQuantity(state, action: PayloadAction<CartItem['productId']>) {
      state.error = null;
      const item = state.items.find((item) => item.productId === action.payload);
      if (!item) return;
      item.quantity++;
      item.totalPrice = item.quantity * item.unitPrice;
      state.status = 'succeeded';
    },
    decreaseItemQuantity(state, action: PayloadAction<CartItem['productId']>) {
      state.error = null;
      const item = state.items.find((item) => item.productId === action.payload);
      if (!item) return;
      item.quantity--;
      item.totalPrice = item.quantity * item.unitPrice;
      if (item.quantity === 0) cartSlice.caseReducers.deleteItem(state, action);
      state.status = 'succeeded';
    },
    clearCart(state) {
      state.error = null;
      state.items = [];
      state.status = 'succeeded';
    },
    rollbackCart(
      state,
      action: PayloadAction<{ items: CartItem[]; error: string }>
    ) {
      state.items = action.payload.items;
      state.status = 'failed';
      state.error = action.payload.error;
    },
  },
});

export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
  rollbackCart,
} = cartSlice.actions;

export default cartSlice.reducer;
