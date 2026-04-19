import type { CartItem } from "@/types";

import { formatCurrency } from "@/components/utils/helpers";

type OrderSummaryProps = {
  cart: CartItem[];
  subtotal: number;
  priorityPrice: number;
  totalPrice: number;
};

function OrderSummary({
  cart,
  subtotal,
  priorityPrice,
  totalPrice,
}: OrderSummaryProps): JSX.Element {
  return (
    <div className="space-y-5 rounded-[2rem] border border-[#ead9ca] bg-[#fffaf5] p-6 shadow-[0_24px_60px_-44px_rgba(36,25,21,0.34)]">
      <div>
        <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.24em] text-[#8c6659]">
          Order Summary
        </p>
      </div>

      <ul className="space-y-3">
        {cart.map((item) => (
          <li
            key={item.productId}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 text-sm text-[#4d3932]"
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

      <div className="space-y-3 border-t border-[#ead9ca] pt-4 text-sm text-[#4d3932]">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {priorityPrice > 0 ? (
          <div className="flex items-center justify-between">
            <span>+{formatCurrency(priorityPrice)} for priority delivery</span>
            <span>{formatCurrency(priorityPrice)}</span>
          </div>
        ) : null}
        <div className="flex items-center justify-between text-lg font-semibold text-[#241915]">
          <span>Total</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
