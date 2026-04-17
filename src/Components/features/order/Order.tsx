// Test ID: IIDSAT
import { useEffect } from 'react';
import type { LoaderFunctionArgs } from 'react-router-dom';
import { useFetcher, useLoaderData } from 'react-router-dom';

import type { Order as OrderModel, Product } from '@/types';

import { ROUTES } from '@/constants/routes';

import { getOrder } from '@/components/services/helper';
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from '@/components/utils/helpers';
import OrderItem from '@/components/features/order/OrderItem';
import UpdateOrder from '@/components/features/order/UpdateOrder';

function Order(): JSX.Element {
  const order = useLoaderData() as OrderModel;
  const fetcher = useFetcher<Product[]>();

  useEffect(
    function () {
      if (!fetcher.data && fetcher.state === "idle")
        fetcher.load(ROUTES.PRODUCTS);
    },
    [fetcher]
  );

  // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff
  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order;
  const safeOrderPrice = orderPrice ?? 0;
  const safePriorityPrice = priorityPrice ?? 0;

  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div>
      <div>
        <h2>Order #{id} status</h2>

        <div>
          {priority && (
            <span>
              Priority
            </span>
          )}
          <span>
            {status} order
          </span>
        </div>
      </div>

      <div>
        <p>
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : "Order should have arrived"}
        </p>
        <p>
          (Estimated delivery: {formatDate(estimatedDelivery)})
        </p>
      </div>

      <ul>
        {cart.map((item) => (
          <OrderItem
            item={item}
            key={item.productId}
            isLoadingIngredients={fetcher.state === "loading"}
            ingredients={
              fetcher?.data?.find((el) => el.id === item.productId)?.tags ?? []
            }
          />
        ))}
      </ul>

      <div>
        <p>
          Order subtotal: {formatCurrency(safeOrderPrice)}
        </p>
        {priority && (
          <p>
            Price priority: {formatCurrency(safePriorityPrice)}
          </p>
        )}
        <p>
          To pay on delivery: {formatCurrency(safeOrderPrice + safePriorityPrice)}
        </p>
      </div>

      {!priority && <UpdateOrder />}
    </div>
  );
}

export async function loader({
  params,
}: LoaderFunctionArgs): Promise<OrderModel | null> {
  const order = params.orderId ? await getOrder(params.orderId) : null;
  return order;
}

export default Order;
