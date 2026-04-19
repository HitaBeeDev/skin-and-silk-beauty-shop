import type { CartItem as CartItemModel } from "@/types";

import CartItem from "@/components/features/cart/CartItem";

type CartItemListProps = {
  cart: CartItemModel[];
  onRemove: (product: CartItemModel) => void;
};

function CartItemList({
  cart,
  onRemove,
}: CartItemListProps): JSX.Element {
  return (
    <div className="overflow-hidden rounded-[1.1rem] bg-white shadow-[0_24px_60px_rgba(85,0,0,0.10)]">
      <ul>
        {cart.map((product: CartItemModel) => (
          <li key={product.productId}>
            <CartItem onRemove={onRemove} product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CartItemList;
