import { useEffect, useState } from 'react';
import { useLoaderData, useSearchParams } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

import type { Order } from '@/types';

import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from '@/components/utils/helpers';

function OrderConfirmation(): JSX.Element {
  const order = useLoaderData() as Order;
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSuccessToastOpen, setIsSuccessToastOpen] = useState(
    searchParams.get('toast') === 'placed'
  );
  const subtotal =
    order.orderPrice ?? order.cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const priorityPrice =
    order.priorityPrice ?? (order.priority ? subtotal * 0.2 : 0);
  const total = subtotal + priorityPrice;
  const deliveryIn = Math.max(calcMinutesLeft(order.estimatedDelivery), 0);

  useEffect(() => {
    if (searchParams.get('toast') !== 'placed') {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('toast');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  return (
    <section>
      <p>Order confirmed</p>
      <h1>Order #{order.id}</h1>
      <p>Your order is in the queue and will be prepared shortly.</p>

      <div>
        <p>Estimated delivery</p>
        <p>{formatDate(order.estimatedDelivery)}</p>
        <p>{deliveryIn} minutes remaining</p>
      </div>

      <div>
        <h2>Order summary</h2>
        <ul>
          {order.cart.map((item) => (
            <li key={item.productId}>
              <span>{item.quantity}x {item.name}</span>
              <span>{formatCurrency(item.totalPrice)}</span>
            </li>
          ))}
        </ul>

        <p>Total: {formatCurrency(total)}</p>
      </div>

      <div>
        <Button to={ROUTES.ORDER_DETAIL.replace(':orderId', order.id)}>
          Track your order
        </Button>
        <Button to={ROUTES.PRODUCTS} variant="secondary">
          Continue shopping
        </Button>
      </div>

      <Toast
        duration={2000}
        message="Order placed successfully."
        onClose={() => setIsSuccessToastOpen(false)}
        open={isSuccessToastOpen}
        position="top-right"
        tone="success"
      />
    </section>
  );
}

export default OrderConfirmation;
