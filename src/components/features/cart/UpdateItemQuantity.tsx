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
    <div className="inline-flex items-center rounded-full border border-[#d9c0ae] bg-white">
      <button
        aria-label={
          currentQuantity === 1
            ? `Remove ${productName}`
            : "Decrease item quantity"
        }
        className="inline-flex h-11 w-11 items-center justify-center text-xl text-[#5a4034] transition-colors duration-150 ease-in hover:bg-[#f8efe7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a4034] focus-visible:ring-offset-2"
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

      <p className="min-w-[2.75rem] text-center font-semibold text-[#241915]">
        {currentQuantity}
      </p>

      <button
        aria-label="Increase item quantity"
        className="inline-flex h-11 w-11 items-center justify-center text-xl text-[#5a4034] transition-colors duration-150 ease-in hover:bg-[#f8efe7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a4034] focus-visible:ring-offset-2"
        onClick={() => dispatch(increaseItemQuantity(productId))}
        type="button"
      >
        +
      </button>
    </div>
  );
}

export default UpdateItemQuantity;
