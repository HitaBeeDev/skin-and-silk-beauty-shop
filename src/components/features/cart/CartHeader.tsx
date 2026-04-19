function CartHeader(): JSX.Element {
  return (
    <div className="max-w-2xl">
      <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.28em] text-[#8c6659]">
        Cart
      </p>
      <h1 className="mt-3 font-['Playfair_Display',serif] text-4xl text-[#5a4034] sm:text-5xl">
        Your Shopping Bag
      </h1>
    </div>
  );
}

export default CartHeader;
