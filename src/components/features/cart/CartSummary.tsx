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
      <div className="overflow-hidden rounded-[1.1rem] shadow-[0_24px_60px_rgba(85,0,0,0.12)]">
        <div className="bg-[#550000] px-6 py-5">
          <p className="text-[0.68rem] font-[500] uppercase tracking-[0.24em] text-[#ffcad4]">
            Order Summary
          </p>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-sm text-[#ffe3e7]">Subtotal</span>
            <span className="font-['Playfair_Display',serif] text-2xl font-semibold text-white">
              {formatCurrency(totalCartPrice)}
            </span>
          </div>
          <p className="mt-4 rounded-[0.7rem] bg-white/10 px-4 py-3 text-[0.78rem] leading-6 text-[#ffe3e7]">
            Free shipping on all orders.
          </p>
        </div>

        <div className="bg-white px-6 py-5">
          <div className="flex flex-col gap-3">
            <Button
              className="!w-full !rounded-full !border-0 !bg-[#550000] text-[0.78rem] !text-white hover:!bg-[#6e0000] sm:text-[0.82rem]"
              size="lg"
              to={ROUTES.CREATE_ORDER}
            >
              Proceed to Checkout
            </Button>

            <Button
              className="!w-full !rounded-full !border-[#550000]/20 text-[0.78rem] !text-[#550000] hover:!bg-[#fff0f0] sm:text-[0.82rem]"
              onClick={onClearCart}
              type="button"
              variant="ghost"
            >
              Clear Cart
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default CartSummary;
