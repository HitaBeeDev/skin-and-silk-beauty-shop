import { combineReducers, configureStore } from "@reduxjs/toolkit";

import ordersReducer from "@/components/features/order/ordersSlice";
import cartReducer from "@/components/features/cart/cartSlice";
import productsReducer from "@/components/features/products/productsSlice";
import userReducer from "@/components/features/user/userSlice";
import {
  loadCartState,
  localStorageMiddleware,
} from "@/store/localStorageMiddleware";

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  products: productsReducer,
  orders: ordersReducer,
});

const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    cart: loadCartState(),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
