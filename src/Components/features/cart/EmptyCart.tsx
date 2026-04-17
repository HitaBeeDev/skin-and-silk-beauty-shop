import { ROUTES } from '@/constants/routes';

import LinkButton from '@/components/ui/LinkButton';

function EmptyCart(): JSX.Element {
  return (
    <div>
      <LinkButton to={ROUTES.PRODUCTS}>&larr; Back to menu</LinkButton>

      <p>
        Your cart is still empty. Start adding some products :)
      </p>
    </div>
  );
}

export default EmptyCart;
