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
    <div className="overflow-hidden rounded-[1.1rem] shadow-[0_24px_60px_rgba(85,0,0,0.12)]">
      <div className="bg-[#550000] px-5 py-5">
        <p className="text-[0.68rem] font-[500] uppercase tracking-[0.24em] text-[#ffcad4]">
          Order Summary
        </p>

        <ul className="mt-4 space-y-3">
          {cart.map((item) => (
            <li
              key={item.productId}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 text-sm text-[#ffe3e7]"
            >
              <span>
                {item.name}{" "}
                <span className="text-[#ffcad4]/70">× {item.quantity}</span>
              </span>
              <span className="font-semibold text-white">
                {formatCurrency(item.totalPrice)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white px-5 py-4">
        <div className="space-y-3 text-sm text-[#5c0120]/80">
          {priorityPrice > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Priority delivery</span>
                <span>{formatCurrency(priorityPrice)}</span>
              </div>
            </>
          ) : null}
          <div className={`flex items-center justify-between text-base font-semibold text-[#550000] ${priorityPrice > 0 ? "border-t border-[#550000]/10 pt-3" : ""}`}>
            <span>Total</span>
            <span className="font-['Playfair_Display',serif] text-xl">
              {formatCurrency(totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
