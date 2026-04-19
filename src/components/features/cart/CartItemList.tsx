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
    <div className="overflow-hidden rounded-[2rem] border border-[#ead9ca] bg-white shadow-[0_24px_60px_-44px_rgba(36,25,21,0.38)]">
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
