import type { CartItem } from '@/types';

import {
  decreaseItemQuantity,
  increaseItemQuantity,
} from '@/components/features/cart/cartSlice';
import { useAppDispatch } from '@store/hooks';

type UpdateItemQuantityProps = {
  productId: CartItem['productId'];
  currentQuantity: number;
};

function UpdateItemQuantity({
  productId,
  currentQuantity,
}: UpdateItemQuantityProps): JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <div>
      <button
        onClick={() => dispatch(decreaseItemQuantity(productId))}
      >
        <p> -</p>
      </button>

      <p>
        {currentQuantity}
      </p>

      <button
        onClick={() => dispatch(increaseItemQuantity(productId))}
      >
        <p> +</p>
      </button>
    </div>
  );
}

export default UpdateItemQuantity;
