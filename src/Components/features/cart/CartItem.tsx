import type { CartItem as CartItemModel } from '@/types';

import DeleteItem from '@/Components/features/cart/DeleteItem';
import UpdateItemQuantity from '@/Components/features/cart/UpdateItemQuantity';
import { getCurrentQuantityById } from '@/Components/features/cart/cartSlice';
import { formatCurrency } from '@/Components/utils/helpers';
import { useAppSelector } from '@/store/hooks';

type CartItemProps = {
  product: CartItemModel;
};

function CartItem({ product }: CartItemProps): JSX.Element {
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
