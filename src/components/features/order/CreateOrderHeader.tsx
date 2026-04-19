import { ROUTES } from "@/constants/routes";

import LinkButton from "@/components/ui/LinkButton";

function CreateOrderHeader(): JSX.Element {
  return (
    <>
      <LinkButton to={ROUTES.CART}>&larr; Back to cart</LinkButton>

      <div className="max-w-2xl">
        <p className="text-[0.68rem] font-[500] uppercase tracking-[0.24em] text-[#8c1d40]">
          Checkout
        </p>
        <h1 className="mt-3 font-['Playfair_Display',serif] text-4xl text-[#550000] sm:text-5xl">
          Confirm your delivery details.
        </h1>
      </div>
    </>
  );
}

export default CreateOrderHeader;
