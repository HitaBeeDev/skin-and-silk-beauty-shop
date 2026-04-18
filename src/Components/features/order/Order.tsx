import { useMemo, useState } from 'react';
import { useLoaderData, useLocation } from 'react-router-dom';

import type { Order as OrderModel } from '@/types';

import {
  rollbackOrderPriorityUpgrade,
  selectOrderById,
  upgradeOrderPriority,
  upgradeOrderPriorityOptimistic,
} from '@/components/features/order/ordersSlice';
import SearchOrder from '@/components/features/order/SearchOrder';
import Badge from '@/components/ui/Badge';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import Error from '@/components/ui/Error';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import Toast from '@/components/ui/Toast';
import { formatCurrency, formatDate } from '@/components/utils/helpers';
import { ROUTES } from '@/constants/routes';
import { useAppDispatch, useAppSelector } from '@store/hooks';

function formatOrderConfirmationId(orderId: string): string {
  const numericPart = orderId.replace(/\D/g, '');
  return `#ORD-${numericPart.slice(-5).padStart(5, '0')}`;
}

function parseOrderCreatedAt(orderId: string, fallbackDate: string): Date {
  const timestamp = Number(orderId.replace('ord_', ''));

  if (Number.isFinite(timestamp) && timestamp > 0) {
    return new Date(timestamp);
  }

  return new Date(fallbackDate);
}

function getStatusMeta(status: string): {
  label: string;
  tone: 'warning' | 'accent' | 'success' | 'danger' | 'neutral';
  className: string;
} {
  switch (status.toLowerCase()) {
    case 'preparing':
      return {
        label: 'Preparing',
        tone: 'neutral',
        className: 'bg-blue-100 text-blue-800',
      };
    case 'out for delivery':
      return {
        label: 'Out for Delivery',
        tone: 'neutral',
        className: 'bg-purple-100 text-purple-800',
      };
    case 'delivered':
      return {
        label: 'Delivered',
        tone: 'success',
        className: '',
      };
    case 'pending':
    case 'new':
    default:
      return {
        label: 'Pending',
        tone: 'warning',
        className: '',
      };
  }
}

function Order(): JSX.Element {
  const loadedOrder = useLoaderData() as OrderModel;
  const location = useLocation();
  const dispatch = useAppDispatch();
  const storedOrder = useAppSelector(selectOrderById(loadedOrder.id));
  const order = storedOrder ?? loadedOrder;
  const [isUpdatingPriority, setIsUpdatingPriority] = useState(false);
  const [toastState, setToastState] = useState<{
    id: number;
    open: boolean;
    tone: 'success' | 'error';
    message: string;
  }>({
    id: 0,
    open: false,
    tone: 'success',
    message: '',
  });

  const statusMeta = useMemo(() => getStatusMeta(order.status), [order.status]);
  const orderIdLabel = useMemo(() => formatOrderConfirmationId(order.id), [order.id]);
  const placedAt = useMemo(
    () => parseOrderCreatedAt(order.id, order.estimatedDelivery),
    [order.estimatedDelivery, order.id]
  );
  const subtotal =
    order.orderPrice ?? order.cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const priorityPrice =
    order.priorityPrice ?? (order.priority ? subtotal * 0.2 : 0);
  const total = subtotal + priorityPrice;

  async function handlePriorityUpgrade(): Promise<void> {
    const previousOrderSnapshot: OrderModel = {
      ...order,
      cart: order.cart.map((item) => ({ ...item })),
    };

    setIsUpdatingPriority(true);
    setToastState((current) => ({ ...current, open: false }));
    dispatch(upgradeOrderPriorityOptimistic(order.id));

    try {
      await dispatch(upgradeOrderPriority(order.id)).unwrap();
      setToastState((current) => ({
        id: current.id + 1,
        open: true,
        tone: 'success',
        message: 'Upgraded to priority delivery.',
      }));
    } catch {
      dispatch(rollbackOrderPriorityUpgrade(previousOrderSnapshot));
      setToastState((current) => ({
        id: current.id + 1,
        open: true,
        tone: 'error',
        message: 'Could not upgrade this order to priority. The change was reverted.',
      }));
    } finally {
      setIsUpdatingPriority(false);
    }
  }

  return (
    <ErrorBoundary
      fallback={(error) => (
        <Error
          message={error.message || 'The order details could not be rendered.'}
        />
      )}
      resetKey={location.pathname}
    >
      <section className="mx-auto w-[min(100%-2rem,72rem)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <Breadcrumb
            items={[
              { label: 'Home', to: ROUTES.HOME },
              { label: 'Orders', to: `${ROUTES.HOME}#order-search` },
              { label: orderIdLabel },
            ]}
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.75fr)] lg:items-start">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.28em] text-[#8c6659]">
                  Order Details
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="font-['Playfair_Display',serif] text-4xl text-[#5a4034] sm:text-5xl">
                      {orderIdLabel}
                    </h1>
                    <p className="mt-3 text-sm leading-7 text-[#5b463d]">
                      Placed on {formatDate(placedAt.toISOString())}
                    </p>
                  </div>
                  <Badge
                    className={statusMeta.className ? `px-3 py-1 text-sm ${statusMeta.className}` : 'px-3 py-1 text-sm'}
                    tone={statusMeta.className ? 'neutral' : statusMeta.tone}
                  >
                    {statusMeta.label}
                  </Badge>
                </div>
              </div>

              <div className="rounded-[2rem] border border-[#ead9ca] bg-[#fffaf5] p-6 shadow-[0_24px_60px_-44px_rgba(36,25,21,0.34)]">
                <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.24em] text-[#8c6659]">
                  Customer information
                </p>
                <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8c6659]">
                      Name
                    </dt>
                    <dd className="mt-2 text-base text-[#241915]">{order.customer}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8c6659]">
                      Phone
                    </dt>
                    <dd className="mt-2 text-base text-[#241915]">{order.phone}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8c6659]">
                      Delivery address
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-[#241915]">{order.address}</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-[2rem] border border-[#ead9ca] bg-white p-6 shadow-[0_24px_60px_-44px_rgba(36,25,21,0.34)]">
                <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.24em] text-[#8c6659]">
                  Items
                </p>
                <div className="mt-5 space-y-0">
                  {order.cart.map((item, index) => (
                    <div
                      key={item.productId}
                      className={`grid grid-cols-[minmax(0,1.4fr)_auto_auto] gap-4 px-1 py-4 ${index < order.cart.length - 1 ? 'border-b border-[#ead9ca]' : ''}`}
                    >
                      <div>
                        <p className="font-medium text-[#241915]">{item.name}</p>
                        <p className="mt-1 text-sm text-[#8c6659]">Qty {item.quantity}</p>
                      </div>
                      <p className="text-right text-sm text-[#5b463d]">
                        {formatCurrency(item.unitPrice)}
                      </p>
                      <p className="text-right font-semibold text-[#241915]">
                        {formatCurrency(item.totalPrice)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-3 border-t border-[#ead9ca] pt-4 text-sm text-[#5b463d]">
                  <div className="flex items-center justify-between">
                    <span>Order subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {order.priority ? (
                    <div className="flex items-center justify-between">
                      <span>Priority surcharge</span>
                      <span>{formatCurrency(priorityPrice)}</span>
                    </div>
                  ) : null}
                  <div className="flex items-center justify-between text-lg font-bold text-[#241915]">
                    <span>Order total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-28">
              <SearchOrder compact title="Look up another order" />

              <div className="rounded-[2rem] border border-[#ead9ca] bg-[#fffaf5] p-6 shadow-[0_24px_60px_-44px_rgba(36,25,21,0.34)]">
                <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.24em] text-[#8c6659]">
                  Delivery options
                </p>
                {!order.priority ? (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm leading-7 text-[#5b463d]">
                      Standard delivery is active. Upgrade if you want this order prioritized.
                    </p>
                    <Button
                      disabled={isUpdatingPriority}
                      onClick={() => {
                        void handlePriorityUpgrade();
                      }}
                      variant="secondary"
                    >
                      {isUpdatingPriority ? 'Upgrading...' : 'Upgrade to Priority'}
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4">
                    <Badge className="px-3 py-1 text-sm" tone="success">
                      Priority Delivery
                    </Badge>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>

        <Toast
          key={toastState.id}
          duration={4000}
          message={toastState.message}
          onClose={() =>
            setToastState((current) => ({ ...current, open: false }))
          }
          open={toastState.open}
          position="bottom-right"
          tone={toastState.tone}
        />
      </section>
    </ErrorBoundary>
  );
}

export default Order;
