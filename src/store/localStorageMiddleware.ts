import type { Middleware } from '@reduxjs/toolkit';

import type { CartItem, LoadingStatus } from '@/types';

const CART_STORAGE_KEY = 'elan-beauty-cart';

export type CartPreloadedState = {
  items: CartItem[];
  status: LoadingStatus;
  error: string | null;
};

export function loadCartState(): CartPreloadedState {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return {
      items: [],
      status: 'idle',
      error: null,
    };
  }

  try {
    const storedItems = window.localStorage.getItem(CART_STORAGE_KEY);
    const items = storedItems ? (JSON.parse(storedItems) as CartItem[]) : [];

    return {
      items,
      status: 'succeeded',
      error: null,
    };
  } catch {
    return {
      items: [],
      status: 'failed',
      error: 'Failed to restore cart from local storage.',
    };
  }
}

function shouldPersistCart(actionType: string): boolean {
  return actionType.startsWith('cart/');
}

export const localStorageMiddleware: Middleware =
  (storeApi) => (next) => (action) => {
    const result = next(action);
    const actionType = typeof action === 'object' && action !== null && 'type' in action
      ? String(action.type)
      : '';

    if (
      shouldPersistCart(actionType) &&
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    ) {
      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify((storeApi.getState() as { cart: CartPreloadedState }).cart.items)
      );
    }

    return result;
  };
