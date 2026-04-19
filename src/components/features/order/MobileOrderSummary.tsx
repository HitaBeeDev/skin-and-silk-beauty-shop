import type { CartItem } from "@/types";

import OrderSummary from "@/components/features/order/OrderSummary";

type MobileOrderSummaryProps = {
  cart: CartItem[];
  isOpen: boolean;
  subtotal: number;
  priorityPrice: number;
  totalPrice: number;
  onToggle: () => void;
};

function MobileOrderSummary({
  cart,
  isOpen,
  subtotal,
  priorityPrice,
  totalPrice,
  onToggle,
}: MobileOrderSummaryProps): JSX.Element {
  return (
    <div className="lg:hidden">
      <div className="overflow-hidden rounded-[1.1rem] shadow-[0_24px_60px_rgba(85,0,0,0.10)]">
        <button
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between bg-[#550000] px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8c1d40] focus-visible:ring-offset-2"
          onClick={onToggle}
          type="button"
        >
          <span className="text-[0.68rem] font-[500] uppercase tracking-[0.24em] text-[#ffcad4]">
            Order Summary
          </span>
          <span className="text-xs text-[#ffe3e7]">{isOpen ? "Hide" : "Show"}</span>
        </button>
        {isOpen ? (
          <OrderSummary
            cart={cart}
            priorityPrice={priorityPrice}
            subtotal={subtotal}
            totalPrice={totalPrice}
          />
        ) : null}
      </div>
    </div>
  );
}

export default MobileOrderSummary;
