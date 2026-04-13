import { useState } from 'react';
import type { ActionFunctionArgs } from 'react-router-dom';
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { CartItem, Order } from '@/types';

import store from '../../../store';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { createOrder } from '../../services/helper';
import { formatCurrency } from '../../utils/helpers';
import EmptyCart from '../cart/EmptyCart';
import { clearCart, getCart, getTotalCartPrice } from '../cart/cartSlice';
import { fetchAddress } from '../user/userSlice';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str: string): boolean =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

type OrderActionData = {
  phone?: string;
};

function CreateOrder() {
  const [withPriority, setWithPriority] = useState<boolean>(false);
  const {
    username,
    status: addressStatus,
    position,
    address,
  } = useAppSelector((state) => state.user);
  const isLoadingAddress = addressStatus === 'loading';

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const formErrors = useActionData() as OrderActionData | undefined;
  const dispatch = useAppDispatch();

  const cart = useAppSelector(getCart);
  const totalCartPrice = useAppSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if (!cart.length) return <EmptyCart />;

  //   {
  //     /* #F6E6DA  (Soft Nude)
  //  #FFFBF5  (Ivory White)
  //  #E8B4B8  (Muted Rose)
  //  #9C8F8F  (Satin Taupe)
  //  #5A4034  (Deep Espresso)
  // #D4B189  (Subtle Gold) */
  //   }

  return (
    <div className="mt-6 flex flex-col justify-center items-center">
      <p className="font-['Quicksand'] md:text-[1.2rem] text-[1rem] text-[#2e1f1a] font-[500] md:leading-[6rem] md:tracking-[0.15rem] mt-10 md:mt-0">
        Ready to place your order? Let’s make it happen!
      </p>

      <Form
        method="POST"
        className="mt-6 md:border md:border-[#FFFBF5] md:rounded-[1.5rem] md:shadow-md grid grid-cols-2 gap-y-4 items-center p-5"
      >
        {/* First Name */}
        <label className="font-['Quicksand'] font-medium text-[0.9rem] text-[#5A4034]">
          First Name
        </label>
        <input
          className="border border-[#F6E6DA] rounded-[1rem] text-[#5A4034] font-['Quicksand'] 
      font-medium text-[0.85rem] h-[2.5rem] md:w-[18rem] pl-3 focus:outline-none focus:border-[#F6E6DA]"
          type="text"
          name="customer"
          defaultValue={username}
          required
          placeholder="Enter your first name"
        />

        {/* Phone Number */}
        <label className="font-['Quicksand'] font-medium text-[0.9rem] text-[#5A4034]">
          Phone Number
        </label>
        <input
          className="border border-[#F6E6DA] rounded-[1rem] font-['Quicksand'] font-medium 
      text-[0.85rem] h-[2.5rem] md:w-[18rem] pl-3 text-[#5A4034] focus:outline-none focus:border-[#F6E6DA]"
          type="tel"
          name="phone"
          required
          placeholder="Enter your phone number"
        />

        {/* Address */}
        <label className="font-['Quicksand'] font-medium text-[0.9rem] text-[#5A4034]">
          Address
        </label>
        <div className="relative w-[18rem]">
          <input
            className="border border-[#F6E6DA] rounded-[1rem] font-['Quicksand'] font-normal text-[0.8rem] 
        h-[2.5rem] md:w-full w-[11.8rem] pl-3 focus:outline-none focus:border-[#F6E6DA]"
            type="text"
            name="address"
            disabled={isLoadingAddress}
            defaultValue={address}
            required
            placeholder="Enter your address"
          />
          {!position.latitude && !position.longitude && (
            <button
              className="absolute cursor-pointer right-1 top-1"
              disabled={isLoadingAddress}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                dispatch(fetchAddress());
              }}
            >
              <FontAwesomeIcon
                className="text-[#5A4034] w-9"
                icon={faLocationDot}
              />
            </button>
          )}
        </div>

        {/* Bottom Section */}
        <div className="mt-10 w-full col-span-2 flex md:flex-row flex-col gap-5 md:gap-0 justify-between items-center">
          <div className="flex flex-row gap-2 items-center">
            <input
              type="checkbox"
              name="priority"
              id="priority"
              value="true"
              checked={withPriority}
              onChange={(e) => setWithPriority(e.target.checked)}
            />

            <label
              className="font-['Quicksand'] font-semibold text-[0.9rem] text-[#5A4034]"
              htmlFor="priority"
            >
              Want to prioritize your order?
            </label>
          </div>

          <div>
            <input type="hidden" name="cart" value={JSON.stringify(cart)} />

            <input
              type="hidden"
              name="position"
              value={
                position.longitude && position.latitude
                  ? `${position.latitude},${position.longitude}`
                  : ''
              }
            />

            <button
              className="cursor-pointer h-9 w-[15rem] rounded-[1rem] border border-[#9C8F8F] flex justify-center items-center
          transition-all duration-500 hover:bg-[#E8B4B8] bg-[#5A4034] hover:border-[#E8B4B8]
          font-['Quicksand'] font-medium text-[0.9rem] text-[#FFFBF5]"
              disabled={isSubmitting || isLoadingAddress}
            >
              {isSubmitting
                ? 'Placing order....'
                : `Order now from ${formatCurrency(totalPrice)}`}
            </button>
          </div>
        </div>
      </Form>
      {formErrors?.phone ? (
        <p className="mt-4 text-sm text-red-600">{formErrors.phone}</p>
      ) : null}
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order: Omit<Order, 'id'> = {
    ...data,
    customer: String(data.customer ?? ''),
    phone: String(data.phone ?? ''),
    address: String(data.address ?? ''),
    cart: JSON.parse(String(data.cart ?? '[]')) as CartItem[],
    priority: data.priority === 'true',
    status: 'new',
    estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    position: undefined,
  };

  const errors: OrderActionData = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      "Please give us your correct phone number. We might need it to contact you.";

  if (Object.keys(errors).length > 0) return errors;

  // If everything is okay, create new order and redirect
  const newOrder = await createOrder(order);

  // Do NOT overuse
  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
