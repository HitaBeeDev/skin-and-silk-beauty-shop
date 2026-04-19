import { ROUTES } from "@/constants/routes";

import LinkButton from "@/components/ui/LinkButton";

function CreateOrderHeader(): JSX.Element {
  return (
    <>
      <LinkButton to={ROUTES.CART}>&larr; Back to cart</LinkButton>

      <div className="max-w-2xl">
        <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.28em] text-[#8c6659]">
          Checkout
        </p>
        <h1 className="mt-3 font-['Playfair_Display',serif] text-4xl text-[#5a4034] sm:text-5xl">
          Confirm your delivery details.
        </h1>
      </div>
    </>
  );
}

export default CreateOrderHeader;
