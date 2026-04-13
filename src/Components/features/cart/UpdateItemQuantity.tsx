import type { CartItem } from '@/types';

import { useAppDispatch } from '../../../store/hooks';
import { decreaseItemQuantity, increaseItemQuantity } from './cartSlice';

type UpdateItemQuantityProps = {
  productId: CartItem['productId'];
  currentQuantity: number;
};

function UpdateItemQuantity({
  productId,
  currentQuantity,
}: UpdateItemQuantityProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-row items-center md:gap-4 gap-2">
      <button
        className="bg-[#E8B4B8] text-[#FFFBF5] md:w-6 md:h-6 w-5 h-5 md:text-[0.9rem] text-[0.8rem] font-medium rounded-full flex justify-center items-center cursor-pointer"
        onClick={() => dispatch(decreaseItemQuantity(productId))}
      >
        <p className="text-center"> -</p>
      </button>

      <p className="font-['Quicksand'] md:text-[0.9rem] text-[0.8rem] font-medium">
        {currentQuantity}
      </p>

      <button
        className="bg-[#E8B4B8] text-[#FFFBF5] md:w-6 md:h-6 w-5 h-5 md:text-[0.9rem] text-[0.8rem] font-medium rounded-full flex justify-center items-center cursor-pointer"
        onClick={() => dispatch(increaseItemQuantity(productId))}
      >
        <p className="text-center"> +</p>
      </button>
    </div>
  );
}

export default UpdateItemQuantity;
