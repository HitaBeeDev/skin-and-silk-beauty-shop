import { ROUTES } from '@/constants/routes';

import shoppingBag from '@/assets/shoppingBag.svg';
import Button from '@/components/ui/Button';

function EmptyCart(): JSX.Element {
  return (
    <div className="mx-auto flex min-h-[60vh] w-[min(100%-2rem,40rem)] flex-col items-center justify-center px-4 py-12 text-center sm:px-6 lg:px-8">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#f6e6da]">
        <img className="h-10 w-10 opacity-80" src={shoppingBag} alt="Empty shopping bag" />
      </div>
      <h2 className="mt-6 font-['Playfair_Display',serif] text-4xl text-[#5a4034]">
        Your bag is empty
      </h2>
      <p className="mt-3 max-w-md text-sm leading-7 text-[#5b463d]">
        Add a few products to start building a polished skincare and makeup ritual.
      </p>
      <div className="mt-8">
        <Button size="lg" to={ROUTES.PRODUCTS}>
          Start Shopping
        </Button>
      </div>
    </div>
  );
}

export default EmptyCart;
