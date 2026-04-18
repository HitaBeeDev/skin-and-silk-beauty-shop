// Test ID: IIDSAT
import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import type { Order as OrderModel, Product } from '@/types';

import {
  rollbackOrderPriorityUpgrade,
  selectOrderById,
  upgradeOrderPriority,
  upgradeOrderPriorityOptimistic,
} from '@/components/features/order/ordersSlice';
import {
  fetchProducts,
  selectProducts,
  selectProductsStatus,
} from '@/components/features/products/productsSlice';
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from '@/components/utils/helpers';
import OrderItem from '@/components/features/order/OrderItem';
import UpdateOrder from '@/components/features/order/UpdateOrder';
import Toast from '@/components/ui/Toast';
import { useAppDispatch, useAppSelector } from '@store/hooks';

function Order(): JSX.Element {
  const loadedOrder = useLoaderData() as OrderModel;
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const productsStatus = useAppSelector(selectProductsStatus);
  const storedOrder = useAppSelector(selectOrderById(loadedOrder.id));
  const order = storedOrder ?? loadedOrder;
  const [isUpdatingPriority, setIsUpdatingPriority] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);

  useEffect(
    function () {
      void dispatch(fetchProducts());
    },
    [dispatch]
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
  const safeOrderPrice =
    orderPrice ?? cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const safePriorityPrice =
    priorityPrice ?? (priority ? safeOrderPrice * 0.2 : 0);

  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  async function handlePriorityUpgrade(): Promise<void> {
    const previousOrderSnapshot: OrderModel = {
      ...order,
      cart: order.cart.map((item) => ({ ...item })),
    };

    setIsUpdatingPriority(true);
    setIsToastOpen(false);
    dispatch(upgradeOrderPriorityOptimistic(id));

    try {
      await dispatch(upgradeOrderPriority(id)).unwrap();
    } catch {
      dispatch(rollbackOrderPriorityUpgrade(previousOrderSnapshot));
      setIsToastOpen(true);
    } finally {
      setIsUpdatingPriority(false);
    }
  }

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
            isLoadingIngredients={productsStatus === 'loading'}
            ingredients={
              products.find((el: Product) => el.id === item.productId)?.tags ?? []
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

      {!priority && (
        <UpdateOrder
          disabled={isUpdatingPriority}
          onUpgrade={() => {
            void handlePriorityUpgrade();
          }}
        />
      )}

      <Toast
        duration={4000}
        message="Could not upgrade this order to priority. The change was reverted."
        onClose={() => setIsToastOpen(false)}
        open={isToastOpen}
        tone="error"
      />
    </div>
  );
}

export default Order;
