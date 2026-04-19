import { ROUTES } from "@/constants/routes";

import Button from "@/components/ui/Button";
import { formatCurrency } from "@/components/utils/helpers";

type CartSummaryProps = {
  totalCartPrice: number;
  onClearCart: () => void;
};

function CartSummary({
  totalCartPrice,
  onClearCart,
}: CartSummaryProps): JSX.Element {
  return (
    <aside className="lg:sticky lg:top-28">
      <div className="rounded-[2rem] border border-[#ead9ca] bg-[#fffaf5] p-6 shadow-[0_24px_60px_-44px_rgba(36,25,21,0.34)]">
        <div className="space-y-4">
          <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.24em] text-[#8c6659]">
            Order Summary
          </p>

          <div className="flex items-center justify-between border-t border-[#ead9ca] pt-4 text-lg font-semibold text-[#241915]">
            <span>Subtotal</span>
            <span>{formatCurrency(totalCartPrice)}</span>
          </div>

          <p className="rounded-2xl bg-[#f6e6da] px-4 py-3 text-sm leading-6 text-[#5b463d]">
            Free shipping on all orders.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 lg:items-end">
          <Button
            className="w-full lg:min-w-[16rem] lg:w-auto"
            size="lg"
            to={ROUTES.CREATE_ORDER}
          >
            Proceed to Checkout
          </Button>

          <Button onClick={onClearCart} type="button" variant="ghost">
            Clear Cart
          </Button>
        </div>
      </div>
    </aside>
  );
}

export default CartSummary;
