import { ROUTES } from '@/constants/routes';

import shoppingBag from '@/assets/shoppingBag.svg';
import LinkButton from '@/components/ui/LinkButton';

function EmptyCart(): JSX.Element {
  return (
    <div>
      <img src={shoppingBag} alt="Empty shopping bag" />
      <h2>Your cart is empty</h2>
      <p>Add a few products to start building your routine.</p>

      <LinkButton to={ROUTES.PRODUCTS}>Browse Products</LinkButton>
    </div>
  );
}

export default EmptyCart;
