import { Link } from 'react-router-dom';

import { getTotalCartPrice, getTotalCartQuantity } from '@/Components/features/cart/cartSlice';
import { formatCurrency } from '@/Components/utils/helpers';
import { useAppSelector } from '@/store/hooks';

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
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
