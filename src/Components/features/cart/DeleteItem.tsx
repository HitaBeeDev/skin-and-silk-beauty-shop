import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { CartItem } from '@/types';

import { deleteItem } from '@/Components/features/cart/cartSlice';
import { useAppDispatch } from '@/store/hooks';

type DeleteItemProps = {
  productId: CartItem['productId'];
};

function DeleteItem({ productId }: DeleteItemProps): JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <button
      onClick={() => {
        dispatch(deleteItem(productId));
      }}
    >
      <FontAwesomeIcon
        icon={faTrashCan}
      />
    </button>
  );
}

export default DeleteItem;
