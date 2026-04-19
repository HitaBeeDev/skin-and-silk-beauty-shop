import type { CartItem } from "@/types";

import {
  decreaseItemQuantity,
  increaseItemQuantity,
} from "@/components/features/cart/cartSlice";
import { useAppDispatch } from "@store/hooks";

type UpdateItemQuantityProps = {
  productId: CartItem["productId"];
  currentQuantity: number;
  productName: string;
  onRemove: () => void;
};

function UpdateItemQuantity({
  productId,
  currentQuantity,
  productName,
  onRemove,
}: UpdateItemQuantityProps): JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <div className="inline-flex items-center rounded-full border border-[#550000]/20 bg-white">
      <button
        aria-label={
          currentQuantity === 1
            ? `Remove ${productName}`
            : "Decrease item quantity"
        }
        className="inline-flex h-11 w-11 items-center justify-center text-xl text-[#550000] transition-colors duration-150 ease-in hover:bg-[#fff0f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8c1d40] focus-visible:ring-offset-2"
        onClick={() => {
          if (currentQuantity === 1) {
            onRemove();
            return;
          }

          dispatch(decreaseItemQuantity(productId));
        }}
        type="button"
      >
        −
      </button>

      <p className="min-w-[2.75rem] text-center font-semibold text-[#5c0120]">
        {currentQuantity}
      </p>

      <button
        aria-label="Increase item quantity"
        className="inline-flex h-11 w-11 items-center justify-center text-xl text-[#550000] transition-colors duration-150 ease-in hover:bg-[#fff0f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8c1d40] focus-visible:ring-offset-2"
        onClick={() => dispatch(increaseItemQuantity(productId))}
        type="button"
      >
        +
      </button>
    </div>
  );
}

export default UpdateItemQuantity;
