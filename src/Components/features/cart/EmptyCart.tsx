import LinkButton from '@/Components/ui/LinkButton';

function EmptyCart(): JSX.Element {
  return (
    <div>
      <LinkButton to="/products-list">&larr; Back to menu</LinkButton>

      <p>
        Your cart is still empty. Start adding some products :)
      </p>
    </div>
  );
}

export default EmptyCart;
