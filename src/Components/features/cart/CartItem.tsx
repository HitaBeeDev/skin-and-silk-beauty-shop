import type { CartItem as CartItemModel } from '@/types';

import DeleteItem from '@/components/features/cart/DeleteItem';
import UpdateItemQuantity from '@/components/features/cart/UpdateItemQuantity';
import { getCartItemById } from '@/components/features/cart/cartSelectors';
import { formatCurrency } from '@/components/utils/helpers';
import { useAppSelector } from '@store/hooks';

type CartItemProps = {
  product: CartItemModel;
};

function CartItem({ product }: CartItemProps): JSX.Element {
  const { productId, name, unitPrice } = product;
  const currentQuantity =
    useAppSelector(getCartItemById(productId))?.quantity ?? 0;

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
        <DeleteItem product={product} />
      </div>
    </div>
  );
}

export default CartItem;
