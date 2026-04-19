import { ROUTES } from "@/constants/routes";

import shoppingBag from "@/assets/shoppingBag.svg";
import Button from "@/components/ui/Button";

function EmptyCart(): JSX.Element {
  return (
    <div className="mx-auto flex min-h-[60vh] w-[min(100%-2rem,40rem)] flex-col items-center justify-center px-4 py-12 text-center sm:px-6 lg:px-8">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#fff0f2] shadow-[0_18px_45px_rgba(85,0,0,0.10)]">
        <img
          className="h-10 w-10 opacity-75"
          src={shoppingBag}
          alt="Empty shopping bag"
        />
      </div>
      <h2 className="mt-6 font-['Playfair_Display',serif] text-4xl text-[#550000]">
        Your bag is empty
      </h2>
      <p className="mt-3 max-w-md text-sm leading-7 text-[#5c0120]/70">
        Add a few products to start building a polished skincare and makeup
        ritual.
      </p>
      <div className="mt-8">
        <Button
          className="!rounded-full !border-0 !bg-[#550000] !text-white hover:!bg-[#6e0000]"
          size="lg"
          to={ROUTES.PRODUCTS}
        >
          Start Shopping
        </Button>
      </div>
    </div>
  );
}

export default EmptyCart;
