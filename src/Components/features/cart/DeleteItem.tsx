import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import type { CartItem } from '@/types';

import {
  deleteItem,
  restoreDeletedItem,
} from '@/components/features/cart/cartSlice';
import Toast from '@/components/ui/Toast';
import { useAppDispatch } from '@store/hooks';

type DeleteItemProps = {
  product: CartItem;
};

function DeleteItem({ product }: DeleteItemProps): JSX.Element {
  const dispatch = useAppDispatch();
  const [isUndoToastOpen, setIsUndoToastOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          dispatch(deleteItem(product.productId));
          setIsUndoToastOpen(true);
        }}
      >
        <FontAwesomeIcon
          icon={faTrashCan}
        />
      </button>

      <Toast
        duration={4000}
        message={(
          <>
            <span>{product.name} removed.</span>
            <button
              onClick={() => {
                dispatch(restoreDeletedItem(product));
                setIsUndoToastOpen(false);
              }}
              type="button"
            >
              Undo
            </button>
          </>
        )}
        onClose={() => setIsUndoToastOpen(false)}
        open={isUndoToastOpen}
        tone="info"
      />
    </>
  );
}

export default DeleteItem;
