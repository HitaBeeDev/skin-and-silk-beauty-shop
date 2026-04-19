import { useEffect, useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import { PRIORITY_DELIVERY_FEE } from "@/constants/pricing";

import type { Order } from "@/types";

import Button from "@/components/ui/Button";
import { formatCurrency } from "@/components/utils/helpers";

function CheckIcon(): JSX.Element {
  return (
    <svg
      aria-hidden="true"
      className="h-16 w-16 text-green-700"
      fill="none"
      viewBox="0 0 64 64"
    >
      <circle cx="32" cy="32" r="30" fill="currentColor" opacity="0.14" />
      <path
        d="M20 33.5l8 8L45 24.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
    </svg>
  );
}

function parseOrderCreatedAt(orderId: string, fallbackDate: string): Date {
  const timestamp = Number(orderId.replace("ord_", ""));

  if (Number.isFinite(timestamp) && timestamp > 0) {
    return new Date(timestamp);
  }

  return new Date(fallbackDate);
}

function addBusinessDays(baseDate: Date, daysToAdd: number): Date {
  const nextDate = new Date(baseDate);
  let addedDays = 0;

  while (addedDays < daysToAdd) {
    nextDate.setDate(nextDate.getDate() + 1);
    const day = nextDate.getDay();

    if (day !== 0 && day !== 6) {
      addedDays += 1;
    }
  }

  return nextDate;
}

function formatDeliveryRange(orderId: string, fallbackDate: string): string {
  const placedAt = parseOrderCreatedAt(orderId, fallbackDate);
  const rangeStart = addBusinessDays(placedAt, 3);
  const rangeEnd = addBusinessDays(placedAt, 5);
  const formatter = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  });

  return `${formatter.format(rangeStart)} - ${formatter.format(rangeEnd)}`;
}

function formatConfirmationId(orderId: string): string {
  const numericPart = orderId.replace(/\D/g, "");
  return `#ORD-${numericPart.slice(-5).padStart(5, "0")}`;
}

function OrderConfirmation(): JSX.Element {
  const order = useLoaderData() as Order;
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const subtotal =
    order.orderPrice ??
    order.cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const priorityPrice =
    order.priorityPrice ?? (order.priority ? PRIORITY_DELIVERY_FEE : 0);
  const total = subtotal + priorityPrice;
  const confirmationId = useMemo(
    () => formatConfirmationId(order.id),
    [order.id],
  );
  const deliveryRange = useMemo(
    () => formatDeliveryRange(order.id, order.estimatedDelivery),
    [order.estimatedDelivery, order.id],
  );

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (!isCopied) return;

    const timeoutId = window.setTimeout(() => setIsCopied(false), 1500);
    return () => window.clearTimeout(timeoutId);
  }, [isCopied]);

  async function handleCopyOrderId(): Promise<void> {
    try {
      await navigator.clipboard.writeText(confirmationId);
      setIsCopied(true);
    } catch {
      setIsCopied(false);
    }
  }

  return (
    <section
      className={`mx-auto w-[min(100%-2rem,64rem)] px-4 py-16 transition-opacity duration-200 ease-in sm:px-6 lg:px-8 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="rounded-[2.25rem] border border-[#e6d5c6] bg-[linear-gradient(180deg,#fffaf5_0%,#fff5ec_100%)] px-6 py-10 shadow-[0_28px_70px_-44px_rgba(36,25,21,0.4)] sm:px-10 sm:py-12">
        <div className="flex flex-col items-start gap-6">
          <div className="rounded-full bg-green-700/10 p-3">
            <CheckIcon />
          </div>

          <div className="max-w-2xl">
            <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.28em] text-[#6d8d6d]">
              Order Placed Successfully
            </p>
            <h1 className="mt-3 font-['Playfair_Display',serif] text-4xl text-[#5a4034] sm:text-5xl">
              Your order is confirmed and being prepared with care.
            </h1>
            <p className="mt-4 text-sm leading-7 text-[#5b463d]">
              Keep your order number handy for tracking updates and delivery
              support.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)]">
          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-[#ead9ca] bg-white px-5 py-5 shadow-[0_20px_50px_-40px_rgba(36,25,21,0.28)]">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6659]">
                Order ID
              </p>
              <button
                className="mt-3 rounded-2xl border border-[#d9c0ae] bg-[#fffaf5] px-4 py-3 font-mono text-2xl font-semibold text-[#241915] transition-colors duration-150 ease-in hover:border-[#5a4034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a4034] focus-visible:ring-offset-2"
                onClick={() => {
                  void handleCopyOrderId();
                }}
                type="button"
              >
                {confirmationId}
              </button>
              <p
                className={`mt-2 text-sm text-[#6d8d6d] transition-opacity duration-200 ease-in ${isCopied ? "opacity-100" : "opacity-0"}`}
              >
                Copied!
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-[#ead9ca] bg-white px-5 py-5 shadow-[0_20px_50px_-40px_rgba(36,25,21,0.28)]">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6659]">
                Delivery estimate
              </p>
              <p className="mt-3 font-['Playfair_Display',serif] text-3xl text-[#5a4034]">
                3-5 business days
              </p>
              <p className="mt-2 text-sm leading-7 text-[#5b463d]">
                Expected between {deliveryRange}
              </p>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[#ead9ca] bg-white px-5 py-5 shadow-[0_20px_50px_-40px_rgba(36,25,21,0.28)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6659]">
              Order summary
            </p>
            <ul className="mt-5 space-y-3 text-sm text-[#5b463d]">
              {order.cart.map((item) => (
                <li
                  key={item.productId}
                  className="grid grid-cols-[minmax(0,1fr)_auto] gap-4"
                >
                  <span>
                    {item.name}{" "}
                    <span className="text-[#8c6659]">× {item.quantity}</span>
                  </span>
                  <span className="font-semibold text-[#241915]">
                    {formatCurrency(item.totalPrice)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-3 border-t border-[#ead9ca] pt-4 text-sm text-[#5b463d]">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {priorityPrice > 0 ? (
                <div className="flex items-center justify-between">
                  <span>Priority delivery</span>
                  <span>{formatCurrency(priorityPrice)}</span>
                </div>
              ) : null}
              <div className="flex items-center justify-between text-lg font-semibold text-[#241915]">
                <span>Order total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            to={ROUTES.ORDER_DETAIL.replace(":orderId", order.id)}
            variant="secondary"
          >
            Track Order
          </Button>
          <Button to={ROUTES.PRODUCTS}>Continue Shopping</Button>
        </div>
      </div>
    </section>
  );
}

export default OrderConfirmation;
