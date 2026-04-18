import type { ActionFunctionArgs } from 'react-router-dom';
import { replace } from 'react-router-dom';

import type { CartItem, CreateOrderPayload } from '@/types';

import { ROUTES } from '@/constants/routes';
import { clearCart } from '@/components/features/cart/cartSlice';
import { submitOrder } from '@/components/features/order/ordersSlice';
import store from '@store';

export type CreateOrderActionData = {
  phone?: string;
  formError?: string;
};

const isValidPhone = (str: string): boolean =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

export async function action({
  request,
}: ActionFunctionArgs): Promise<Response | CreateOrderActionData | undefined> {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order: CreateOrderPayload = {
    ...data,
    customer: String(data.customer ?? ''),
    phone: String(data.phone ?? ''),
    address: String(data.address ?? ''),
    cart: JSON.parse(String(data.cart ?? '[]')) as CartItem[],
    priority: data.priority === 'true',
    status: 'new',
    estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    position: undefined,
  };

  const errors: CreateOrderActionData = {};
  if (!isValidPhone(order.phone)) {
    errors.phone =
      'Please give us your correct phone number. We might need it to contact you.';
  }

  if (Object.keys(errors).length > 0) return errors;

  try {
    const newOrder = await store.dispatch(submitOrder(order)).unwrap();
    store.dispatch(clearCart());

    return replace(
      ROUTES.ORDER_CONFIRMATION.replace(':orderId', String(newOrder.id))
    );
  } catch {
    return {
      formError: 'We could not place your order right now. Please try again.',
    };
  }
}
