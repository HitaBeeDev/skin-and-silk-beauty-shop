import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { CartItem } from '@/types';

import { useAppDispatch } from '../../../store/hooks';
import { deleteItem } from './cartSlice';

type DeleteItemProps = {
  productId: CartItem['productId'];
};

function DeleteItem({ productId }: DeleteItemProps) {
  const dispatch = useAppDispatch();

  return (
    <button
      className="bg-[#F6E6DA]/50 md:w-8 md:h-8 w-6 h-6 flex justify-center items-center text-center rounded-full cursor-pointer"
      onClick={() => {
        dispatch(deleteItem(productId));
      }}
    >
      <FontAwesomeIcon
        className="md:text-[0.8rem] text-[0.7rem] text-[#5A4034]"
        icon={faTrashCan}
      />
    </button>
  );
}

export default DeleteItem;
