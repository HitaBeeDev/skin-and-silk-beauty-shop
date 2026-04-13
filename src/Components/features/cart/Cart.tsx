import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import CartItem from './CartItem';
import EmptyCart from './EmptyCart';
import { clearCart, getCart } from './cartSlice';

function Cart(): JSX.Element {
  const cart = useAppSelector(getCart);
  const dispatch = useAppDispatch();

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="mt-6 flex flex-col justify-center items-center">
      <p className="font-['Quicksand'] text-[1.5rem] text-[#2e1f1a] font-[500] leading-[6rem] tracking-[0.15rem]">
        Your Shopping Basket
      </p>

      <div className="md:mt-6 border border-[#FFFBF5] md:w-2/3 w-full md:pt-5 md:pb-5 md:pl-8 md:pr-8 md:rounded-[1.5rem] md:shadow-md">
          <ul className="">
          {cart.map((product) => (
            <li
              className="border-b border-[#F6E6DA] mb-5 p-4"
              key={product.productId}
            >
              <CartItem product={product} />
            </li>
          ))}
        </ul>

        <div className="flex md:flex-row flex-col justify-between items-center mt-20">
          <div className="flex flex-row gap-5">
            <Link to="/products-list">
              <button
                className="font-['Quicksand'] font-medium text-[0.9rem] rounded-[1rem] 
        h-9 w-[9.5rem] cursor-pointer transition-all duration-500  bg-[#E8B4B8]/50 hover:bg-[#E8B4B8] border border-[#E8B4B850] hover:border-[#E8B4B8]"
              >
                Return to Menu
              </button>
            </Link>
            <button
              className="font-['Quicksand'] font-medium text-[0.9rem] rounded-[1rem] text-[ #5A4034]
        h-9 w-40 cursor-pointer transition-all duration-500 bg-[#FFFBF5] hover:bg-[#FFFBF5] border border-[#9C8F8F] hover:border-[#9C8F8F]"
              onClick={() => dispatch(clearCart())}
            >
              Remove All Items
            </button>
          </div>

          <div className="flex justify-end items-end w-full mr-20 mt-5 md:!flex-none md:!justify-normal md:!items-start md:!w-auto md:!mr-0 md:!mt-0">
            <div
              className="h-9 md:w-[8.5rem] w-40 cursor-pointer rounded-[1rem] border border-[#9C8F8F] flex justify-center items-center
          transition-all duration-500 hover:bg-[#E8B4B8] bg-[#9C8F8F] hover:border-[#E8B4B8]"
            >
              <Link
                className="font-['Quicksand'] font-medium text-[0.9rem] text-[#FFFBF5]"
                to="/order/new"
              >
                Order
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
