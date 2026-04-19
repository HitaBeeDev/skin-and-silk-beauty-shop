import type { CartItem } from "@/types";

import { formatCurrency } from "@/components/utils/helpers";

type OrderItemProps = {
  item: CartItem;
  isLoadingIngredients: boolean;
  ingredients: string[];
};

function OrderItem({
  item,
  isLoadingIngredients,
  ingredients,
}: OrderItemProps): JSX.Element {
  const { quantity, name, totalPrice } = item;

  return (
    <li>
      <div>
        <p>
          <span>{quantity}&times;</span> {name}
        </p>
        <p>{formatCurrency(totalPrice)}</p>
      </div>
      <p>{isLoadingIngredients ? "Loading..." : ingredients.join(", ")}</p>
    </li>
  );
}

export default OrderItem;
