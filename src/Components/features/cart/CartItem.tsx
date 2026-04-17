import type { CartItem as CartItemModel } from '@/types';

import DeleteItem from '@/components/features/cart/DeleteItem';
import UpdateItemQuantity from '@/components/features/cart/UpdateItemQuantity';
import { getCurrentQuantityById } from '@/components/features/cart/cartSlice';
import { formatCurrency } from '@/components/utils/helpers';
import { useAppSelector } from '@store/hooks';

type CartItemProps = {
  product: CartItemModel;
};

function CartItem({ product }: CartItemProps): JSX.Element {
  const { productId, name, unitPrice } = product;
  const currentQuantity = useAppSelector((state) =>
    getCurrentQuantityById(productId)(state)
  );

  return (
    <div>
      <div>
        {currentQuantity} × {name}
      </div>

      <div>
        {formatCurrency(currentQuantity * unitPrice)}
      </div>

      <div>
        <UpdateItemQuantity
          productId={productId}
          currentQuantity={currentQuantity}
        />
      </div>

      <div>
        <DeleteItem productId={productId} />
      </div>
    </div>
  );
}

export default CartItem;
