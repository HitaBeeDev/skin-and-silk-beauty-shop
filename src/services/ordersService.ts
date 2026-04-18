import type { CreateOrderPayload, Order } from '@/types';

export const ORDERS_STORAGE_KEY = 'elan-beauty-orders';

function canUseLocalStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readOrders(): Order[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  const rawOrders = window.localStorage.getItem(ORDERS_STORAGE_KEY);

  if (!rawOrders) {
    return [];
  }

  try {
    return JSON.parse(rawOrders) as Order[];
  } catch {
    return [];
  }
}

export function writeOrders(orders: Order[]): void {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

function calculateOrderSubtotal(order: Pick<Order, 'cart'>): number {
  return order.cart.reduce((sum, item) => sum + item.totalPrice, 0);
}

function buildOrderPricing(
  order: Pick<Order, 'cart' | 'priority'>
): Pick<Order, 'orderPrice' | 'priorityPrice'> {
  const orderPrice = calculateOrderSubtotal(order);

  return {
    orderPrice,
    priorityPrice: order.priority ? orderPrice * 0.2 : 0,
  };
}

function createOrderId(): string {
  return `ord_${Date.now()}`;
}

/** Simulates `GET /api/orders/:id`. */
export async function getOrder(id: string): Promise<Order> {
  const order = readOrders().find((item) => item.id === id);

  if (!order) {
    throw new Error(`Order ${id} not found`);
  }

  return Promise.resolve(order);
}

/** Simulates `POST /api/orders`. */
export async function createOrder(data: CreateOrderPayload): Promise<Order> {
  const orders = readOrders();
  const nextOrder = {
    ...data,
    id: createOrderId(),
    ...buildOrderPricing(data),
  };

  orders.push(nextOrder);
  writeOrders(orders);

  return Promise.resolve(nextOrder);
}

/** Simulates `PATCH /api/orders/:id`. */
export async function updateOrder(
  id: string,
  patch: Partial<Order>
): Promise<Order> {
  const orders = readOrders();
  const orderIndex = orders.findIndex((item) => item.id === id);

  if (orderIndex === -1) {
    throw new Error(`Order ${id} not found`);
  }

  const updatedOrder = {
    ...orders[orderIndex],
    ...patch,
    id,
  };
  const pricedOrder = {
    ...updatedOrder,
    ...buildOrderPricing(updatedOrder),
  };

  orders[orderIndex] = pricedOrder;
  writeOrders(orders);

  return Promise.resolve(pricedOrder);
}
