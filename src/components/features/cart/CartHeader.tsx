function CartHeader(): JSX.Element {
  return (
    <div className="max-w-2xl">
      <p className="text-[0.68rem] font-[500] uppercase tracking-[0.24em] text-[#8c1d40]">
        Shopping Bag
      </p>
      <h1 className="mt-3 font-['Playfair_Display',serif] text-4xl text-[#550000] sm:text-5xl">
        Your Selections
      </h1>
    </div>
  );
}

export default CartHeader;
