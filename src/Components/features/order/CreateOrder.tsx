import { useState } from 'react';
import { Form, useActionData, useNavigation } from 'react-router-dom';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import EmptyCart from '@/components/features/cart/EmptyCart';
import {
  getCart,
  getIsCartEmpty,
  getTotalCartPrice,
} from '@/components/features/cart/cartSelectors';
import {
  fetchAddress,
  selectUserAddress,
  selectUserPosition,
  selectUserStatus,
  selectUsername,
} from '@/components/features/user/userSlice';
import { formatCurrency } from '@/components/utils/helpers';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import type { CreateOrderActionData } from '@/routes/createOrder.action';

function CreateOrder(): JSX.Element {
  const [withPriority, setWithPriority] = useState<boolean>(false);
  const username = useAppSelector(selectUsername);
  const addressStatus = useAppSelector(selectUserStatus);
  const position = useAppSelector(selectUserPosition);
  const address = useAppSelector(selectUserAddress);
  const isLoadingAddress = addressStatus === 'loading';

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const formErrors = useActionData() as CreateOrderActionData | undefined;
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

export default CreateOrder;
