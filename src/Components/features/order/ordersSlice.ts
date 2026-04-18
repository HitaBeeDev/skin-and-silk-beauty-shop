import {
  createAsyncThunk,
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { CreateOrderPayload, LoadingStatus, Order } from '@/types';
import type { RootState } from '@store';

import { createOrder, getOrder, readOrders, updateOrder } from '@/services/ordersService';

type OrdersState = {
  orders: Order[];
  status: LoadingStatus;
  error: string | null;
  currentOrderId: string | null;
};

const initialState: OrdersState = {
  orders: readOrders(),
  status: 'idle',
  error: null,
  currentOrderId: null,
};

export const submitOrder = createAsyncThunk<
  Order,
  CreateOrderPayload,
  { rejectValue: string }
>('orders/submitOrder', async (payload, thunkApi) => {
  try {
    return await createOrder(payload);
  } catch {
    return thunkApi.rejectWithValue('Failed to submit order.');
  }
});

export const loadOrder = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>('orders/loadOrder', async (id, thunkApi) => {
  try {
    return await getOrder(id);
  } catch {
    return thunkApi.rejectWithValue(`Order ${id} not found.`);
  }
});

export const upgradeOrderPriority = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>('orders/upgradeOrderPriority', async (id, thunkApi) => {
  try {
    return await updateOrder(id, { priority: true });
  } catch {
    return thunkApi.rejectWithValue(`Failed to update order ${id}.`);
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    upgradeOrderPriorityOptimistic(state, action: PayloadAction<string>) {
      const order = state.orders.find((item) => item.id === action.payload);

      if (!order) return;

      const orderPrice =
        order.orderPrice ?? order.cart.reduce((sum, item) => sum + item.totalPrice, 0);

      order.priority = true;
      order.orderPrice = orderPrice;
      order.priorityPrice = orderPrice * 0.2;
      state.error = null;
    },
    rollbackOrderPriorityUpgrade(state, action: PayloadAction<Order>) {
      const existingOrderIndex = state.orders.findIndex(
        (order) => order.id === action.payload.id
      );

      if (existingOrderIndex >= 0) {
        state.orders[existingOrderIndex] = action.payload;
      } else {
        state.orders.push(action.payload);
      }

      state.error = action.payload.id
        ? `Failed to update order ${action.payload.id}.`
        : 'Failed to update order.';
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(submitOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
        state.currentOrderId = action.payload.id;
        state.status = 'succeeded';
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to submit order.';
      })
      .addCase(loadOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadOrder.fulfilled, (state, action) => {
        const existingOrderIndex = state.orders.findIndex(
          (order) => order.id === action.payload.id
        );

        if (existingOrderIndex >= 0) {
          state.orders[existingOrderIndex] = action.payload;
        } else {
          state.orders.push(action.payload);
        }

        state.currentOrderId = action.payload.id;
        state.status = 'succeeded';
      })
      .addCase(loadOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to load order.';
      })
      .addCase(upgradeOrderPriority.pending, (state) => {
        state.error = null;
      })
      .addCase(upgradeOrderPriority.fulfilled, (state, action) => {
        const existingOrderIndex = state.orders.findIndex(
          (order) => order.id === action.payload.id
        );

        if (existingOrderIndex >= 0) {
          state.orders[existingOrderIndex] = action.payload;
        } else {
          state.orders.push(action.payload);
        }

        state.currentOrderId = action.payload.id;
        state.status = 'succeeded';
      })
      .addCase(upgradeOrderPriority.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to update order.';
      }),
});

export const {
  upgradeOrderPriorityOptimistic,
  rollbackOrderPriorityUpgrade,
} = ordersSlice.actions;

export default ordersSlice.reducer;

const selectOrdersState = (state: RootState) => state.orders;

export const selectOrders = createSelector(
  [selectOrdersState],
  (ordersState) => ordersState.orders
);

export const selectOrdersStatus = createSelector(
  [selectOrdersState],
  (ordersState) => ordersState.status
);

export const selectOrdersError = createSelector(
  [selectOrdersState],
  (ordersState) => ordersState.error
);

export const selectCurrentOrderId = createSelector(
  [selectOrdersState],
  (ordersState) => ordersState.currentOrderId
);

export const selectOrderById =
  (orderId: string) =>
    createSelector([selectOrders], (orders) =>
      orders.find((order) => order.id === orderId)
    );
