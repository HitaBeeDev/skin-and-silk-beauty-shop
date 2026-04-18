import type { LoaderFunctionArgs } from 'react-router-dom';

import type { Order } from '@/types';

import { loadOrder } from '@/components/features/order/ordersSlice';
import store from '@store';

export async function loader({
  params,
}: LoaderFunctionArgs): Promise<Order> {
  if (!params.orderId) {
    throw new Response('Order not found.', { status: 404 });
  }

  try {
    return await store.dispatch(loadOrder(params.orderId)).unwrap();
  } catch {
    throw new Response('Order not found.', { status: 404 });
  }
}
