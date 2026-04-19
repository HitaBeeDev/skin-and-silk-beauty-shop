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
      <div className="rounded-[2rem] border border-[#ead9ca] bg-[#fffaf5] shadow-[0_24px_60px_-44px_rgba(36,25,21,0.34)]">
        <button
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between px-5 py-4 text-left font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.2em] text-[#5a4034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a4034] focus-visible:ring-offset-2"
          onClick={onToggle}
          type="button"
        >
          <span>Order Summary</span>
          <span>{isOpen ? "Hide" : "Show"}</span>
        </button>
        {isOpen ? (
          <div className="px-5 pb-5">
            <OrderSummary
              cart={cart}
              priorityPrice={priorityPrice}
              subtotal={subtotal}
              totalPrice={totalPrice}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default MobileOrderSummary;
