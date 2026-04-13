import { Link } from 'react-router-dom';

import shoppingBag from '../../assets/shoppingBag.svg';
import { useAppSelector } from '../../store/hooks';
import { getTotalCartQuantity } from '../features/cart/cartSlice';

function Header() {
  const totalCartQuantity = useAppSelector(getTotalCartQuantity);

  return (
    <div className="grid grid-cols-2 justify-between items-center pl-16 pr-16 pt-6">
      <div className="flex justify-between items-center col-span-1">
        <Link
          to="/"
          className="font-['Playfair_Display'] font-bold text-lg cursor-pointer tracking-[0.2rem]"
        >
          Élan
        </Link>

        <p
          className="font-['Quicksand'] text-[0.9rem] font-medium cursor-pointer 
  border border-transparent hover:border-[#F6E6DA] transition-all duration-500 
  h-8 w-28 rounded-[1rem] flex justify-center items-center text-[#5A4034]"
        >
          Our Story
        </p>

        <p
          className="font-['Quicksand'] text-[0.9rem] font-medium cursor-pointer 
  border border-transparent hover:border-[#F6E6DA] transition-all duration-500 
  h-8 w-32 rounded-[1rem] flex justify-center items-center text-[#5A4034]"
        >
          Our Products
        </p>

        <p
          className="font-['Quicksand'] text-[0.9rem] font-medium cursor-pointer 
  border border-transparent hover:border-[#F6E6DA] transition-all duration-500 
  h-8 w-40 rounded-[1rem] flex justify-center items-center text-[#5A4034]"
        >
          Customer Reviews
        </p>
      </div>

      <div className="col-span-1 flex justify-end items-center gap-4">
        {totalCartQuantity > 0 ? (
          <Link to="/cart" className="relative">
            <img className="w-7" src={shoppingBag} alt="shopping bag" />
            <p
              className="absolute top-[0.35rem] right-0 bg-[#ca6970] text-[#FFFBF5] 
        w-5 h-5 text-[0.75rem] font-medium rounded-full font-['Quicksand']
        flex justify-center items-center transform translate-x-1/2 -translate-y-1/2"
            >
              {totalCartQuantity}
            </p>
          </Link>
        ) : (
          <Link to="/products-list">
            <button
              className="font-['Quicksand'] font-medium text-[0.9rem] rounded-[1rem]
        h-9 w-36 cursor-pointer transition-all duration-500 bg-white text-[#5A4034] border border-[#5A4034]
        hover:bg-[#F6E6DA] hover:border-[#F6E6DA]"
            >
              Start Shopping
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;
