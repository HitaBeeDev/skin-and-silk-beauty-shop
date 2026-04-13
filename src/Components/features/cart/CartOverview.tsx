import { Link } from 'react-router-dom';

import { getTotalCartPrice, getTotalCartQuantity } from '@/Components/features/cart/cartSlice';
import { formatCurrency } from '@/Components/utils/helpers';
import { useAppSelector } from '@/store/hooks';

function CartOverview(): JSX.Element | null {
  const totalCartQuantity = useAppSelector(getTotalCartQuantity);
  const totalCartPrice = useAppSelector(getTotalCartPrice);

  if (!totalCartQuantity) return null;

  return (
    <div className="flex items-center justify-between bg-stone-800 px-4 py-4 text-sm uppercase text-stone-200 sm:px-6 md:text-base">
      <p className="space-x-4 font-semibold text-stone-300 sm:space-x-6">
        <span>{totalCartQuantity} pizzas</span>
        <span>{formatCurrency(totalCartPrice)}</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
