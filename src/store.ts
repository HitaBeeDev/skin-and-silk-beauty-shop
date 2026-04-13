import { configureStore } from '@reduxjs/toolkit';

import cartReducer from '@/Components/features/cart/cartSlice';
import userReducer from '@/Components/features/user/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
