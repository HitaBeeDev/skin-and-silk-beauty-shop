import type { Order } from '@/types';

import { orders, productsList, type ProductsByCategory } from './data';

type CreateOrderInput = Omit<Order, 'id'>;

export async function getProductsList(): Promise<ProductsByCategory> {
  return productsList;
}

export async function getOrder(id: string | number): Promise<Order | null> {
  const order = orders.find((order) => order.id === id);
  if (!order) return null; // Return null instead of throwing an error
  return order;
}

export async function createOrder(newOrder: CreateOrderInput): Promise<Order> {
  try {
    const currentIds = orders
      .map((order) =>
        typeof order.id === 'number' ? order.id : Number.parseInt(order.id, 10)
      )
      .filter((id) => Number.isFinite(id));
    const newId = currentIds.length ? Math.max(...currentIds) + 1 : 1;
    const order = { id: newId, ...newOrder };
    orders.push(order);
    return order;
  } catch {
    throw Error('Failed creating your order');
  }
}

export async function updateOrder(
  id: string | number,
  updateObj: Partial<Order>
): Promise<void> {
  try {
    const orderIndex = orders.findIndex((order) => order.id === id);
    if (orderIndex === -1) throw Error(`Couldn't find order #${id}`);

    orders[orderIndex] = { ...orders[orderIndex], ...updateObj };
  } catch {
    throw Error('Failed updating your order');
  }
}
