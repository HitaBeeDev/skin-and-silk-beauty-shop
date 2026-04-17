import { useState } from 'react';
import type { ActionFunctionArgs } from 'react-router-dom';
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { CartItem, CreateOrderPayload } from '@/types';

import { ROUTES } from '@/constants/routes';

import EmptyCart from '@/components/features/cart/EmptyCart';
import { clearCart } from '@/components/features/cart/cartSlice';
import {
  getCart,
  getIsCartEmpty,
  getTotalCartPrice,
} from '@/components/features/cart/cartSelectors';
import { submitOrder } from '@/components/features/order/ordersSlice';
import {
  fetchAddress,
  selectUserAddress,
  selectUserPosition,
  selectUserStatus,
  selectUsername,
} from '@/components/features/user/userSlice';
import { formatCurrency } from '@/components/utils/helpers';
import store from '@store';
import { useAppDispatch, useAppSelector } from '@store/hooks';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str: string): boolean =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

type OrderActionData = {
  phone?: string;
};

function CreateOrder(): JSX.Element {
  const [withPriority, setWithPriority] = useState<boolean>(false);
  const username = useAppSelector(selectUsername);
  const addressStatus = useAppSelector(selectUserStatus);
  const position = useAppSelector(selectUserPosition);
  const address = useAppSelector(selectUserAddress);
  const isLoadingAddress = addressStatus === 'loading';

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const formErrors = useActionData() as OrderActionData | undefined;
  const dispatch = useAppDispatch();

  const cart = useAppSelector(getCart);
  const isCartEmpty = useAppSelector(getIsCartEmpty);
  const totalCartPrice = useAppSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if (isCartEmpty) return <EmptyCart />;

  //   {
  //     /* #F6E6DA  (Soft Nude)
  //  #FFFBF5  (Ivory White)
  //  #E8B4B8  (Muted Rose)
  //  #9C8F8F  (Satin Taupe)
  //  #5A4034  (Deep Espresso)
  // #D4B189  (Subtle Gold) */
  //   }

  return (
    <div>
      <p>
        Ready to place your order? Let’s make it happen!
      </p>

      <Form
        method="POST"
      >
        {/* First Name */}
        <label>
          First Name
        </label>
        <input
          type="text"
          name="customer"
          defaultValue={username}
          required
          placeholder="Enter your first name"
        />

        {/* Phone Number */}
        <label>
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          required
          placeholder="Enter your phone number"
        />

        {/* Address */}
        <label>
          Address
        </label>
        <div>
          <input
            type="text"
            name="address"
            disabled={isLoadingAddress}
            defaultValue={address}
            required
            placeholder="Enter your address"
          />
          {!position.latitude && !position.longitude && (
            <button
              disabled={isLoadingAddress}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                dispatch(fetchAddress());
              }}
            >
              <FontAwesomeIcon
                icon={faLocationDot}
              />
            </button>
          )}
        </div>

        {/* Bottom Section */}
        <div>
          <div>
            <input
              type="checkbox"
              name="priority"
              id="priority"
              value="true"
              checked={withPriority}
              onChange={(e) => setWithPriority(e.target.checked)}
            />

            <label
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
        <p>{formErrors.phone}</p>
      ) : null}
    </div>
  );
}

export async function action({
  request,
}: ActionFunctionArgs): Promise<Response | OrderActionData | undefined> {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order: CreateOrderPayload = {
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
  const newOrder = await store.dispatch(submitOrder(order)).unwrap();

  // Do NOT overuse
  store.dispatch(clearCart());

  return redirect(ROUTES.ORDER_DETAIL.replace(':orderId', String(newOrder.id)));
}

export default CreateOrder;
