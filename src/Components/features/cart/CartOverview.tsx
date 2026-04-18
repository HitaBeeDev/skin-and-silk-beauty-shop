import { Link } from "react-router-dom";

import { ROUTES } from "@/constants/routes";

import {
  getTotalCartPrice,
  getTotalCartQuantity,
} from "@/components/features/cart/cartSelectors";
import { formatCurrency } from "@/components/utils/helpers";
import { useAppSelector } from "@store/hooks";

function CartOverview(): JSX.Element | null {
  const totalCartQuantity = useAppSelector(getTotalCartQuantity);
  const totalCartPrice = useAppSelector(getTotalCartPrice);

  if (!totalCartQuantity) return null;

  return (
    <div>
      <p>
        <span>{totalCartQuantity} items</span>
        <span>{formatCurrency(totalCartPrice)}</span>
      </p>
      <Link to={ROUTES.CART}>Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
