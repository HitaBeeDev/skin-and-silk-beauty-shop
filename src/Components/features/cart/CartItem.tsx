import type { CartItem as CartItemModel } from '@/types';

import { useAppSelector } from '../../../store/hooks';
import { formatCurrency } from '../../utils/helpers';
import DeleteItem from './DeleteItem';
import UpdateItemQuantity from './UpdateItemQuantity';
import { getCurrentQuantityById } from './cartSlice';

type CartItemProps = {
  product: CartItemModel;
};

function CartItem({ product }: CartItemProps) {
  const { productId, name, unitPrice } = product;
  const currentQuantity = useAppSelector((state) =>
    getCurrentQuantityById(productId)(state)
  );

  return (
    <div className="grid grid-cols-12 justify-center items-center">
      <div className="col-span-6 font-['Quicksand'] md:text-[0.9rem] text-[0.8rem] font-medium">
        {currentQuantity} × {name}
      </div>

      <div className="col-span-2 font-['Quicksand'] md:text-[0.9rem] text-[0.8rem] font-medium">
        {formatCurrency(currentQuantity * unitPrice)}
      </div>

      <div className="col-span-2 flex justify-center">
        <UpdateItemQuantity
          productId={productId}
          currentQuantity={currentQuantity}
        />
      </div>

      <div className="col-span-2 flex justify-center">
        <DeleteItem productId={productId} />
      </div>
    </div>
  );
}

export default CartItem;
