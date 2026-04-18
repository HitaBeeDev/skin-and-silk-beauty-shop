import { useEffect, useReducer } from 'react';
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

type CreateOrderFormState = {
  customer: string;
  phone: string;
  address: string;
  priority: boolean;
  errors: {
    customer?: string;
    phone?: string;
    address?: string;
  };
};

type CreateOrderFormAction =
  | {
      type: 'fieldChanged';
      field: 'customer' | 'phone' | 'address';
      value: string;
    }
  | {
      type: 'priorityChanged';
      value: boolean;
    }
  | {
      type: 'setErrors';
      errors: CreateOrderFormState['errors'];
    }
  | {
      type: 'setFieldError';
      field: 'customer' | 'phone' | 'address';
      error?: string;
    }
  | {
      type: 'syncDefaults';
      payload: Partial<Pick<CreateOrderFormState, 'customer' | 'address'>>;
    };

function validateForm(
  state: Pick<CreateOrderFormState, 'customer' | 'phone' | 'address'>
): CreateOrderFormState['errors'] {
  return {
    customer: state.customer.trim() ? undefined : 'Please enter your first name.',
    phone: state.phone.trim() ? undefined : 'Please enter your phone number.',
    address: state.address.trim() ? undefined : 'Please enter your address.',
  };
}

function createInitialState(
  customer: string,
  address: string
): CreateOrderFormState {
  return {
    customer,
    phone: '',
    address,
    priority: false,
    errors: {},
  };
}

function createOrderFormReducer(
  state: CreateOrderFormState,
  action: CreateOrderFormAction
): CreateOrderFormState {
  switch (action.type) {
    case 'fieldChanged':
      return {
        ...state,
        [action.field]: action.value,
        errors: {
          ...state.errors,
          [action.field]: undefined,
        },
      };
    case 'priorityChanged':
      return {
        ...state,
        priority: action.value,
      };
    case 'setErrors':
      return {
        ...state,
        errors: action.errors,
      };
    case 'setFieldError':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.error,
        },
      };
    case 'syncDefaults':
      return {
        ...state,
        customer: state.customer || action.payload.customer || '',
        address: state.address || action.payload.address || '',
      };
    default:
      return state;
  }
}

function CreateOrder(): JSX.Element {
  const username = useAppSelector(selectUsername);
  const addressStatus = useAppSelector(selectUserStatus);
  const position = useAppSelector(selectUserPosition);
  const address = useAppSelector(selectUserAddress);
  const isLoadingAddress = addressStatus === 'loading';

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const formErrors = useActionData() as CreateOrderActionData | undefined;
  const dispatch = useAppDispatch();
  const [formState, dispatchForm] = useReducer(
    createOrderFormReducer,
    createInitialState(username, address)
  );

  const cart = useAppSelector(getCart);
  const isCartEmpty = useAppSelector(getIsCartEmpty);
  const totalCartPrice = useAppSelector(getTotalCartPrice);
  const priorityPrice = formState.priority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  useEffect(() => {
    dispatchForm({
      type: 'syncDefaults',
      payload: {
        customer: username,
        address,
      },
    });
  }, [address, username]);

  useEffect(() => {
    if (!formErrors?.phone) return;

    dispatchForm({
      type: 'setFieldError',
      field: 'phone',
      error: formErrors.phone,
    });
  }, [formErrors?.phone]);

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
        onSubmit={(event) => {
          const nextErrors = validateForm(formState);
          const hasErrors = Object.values(nextErrors).some(Boolean);

          if (!hasErrors) return;

          event.preventDefault();
          dispatchForm({ type: 'setErrors', errors: nextErrors });
        }}
      >
        {/* First Name */}
        <label>
          First Name
        </label>
        <input
          type="text"
          name="customer"
          value={formState.customer}
          onChange={(event) =>
            dispatchForm({
              type: 'fieldChanged',
              field: 'customer',
              value: event.target.value,
            })
          }
          required
          placeholder="Enter your first name"
        />
        {formState.errors.customer ? <p>{formState.errors.customer}</p> : null}

        {/* Phone Number */}
        <label>
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          value={formState.phone}
          onChange={(event) =>
            dispatchForm({
              type: 'fieldChanged',
              field: 'phone',
              value: event.target.value,
            })
          }
          required
          placeholder="Enter your phone number"
        />
        {formState.errors.phone ? <p>{formState.errors.phone}</p> : null}

        {/* Address */}
        <label>
          Address
        </label>
        <div>
          <input
            type="text"
            name="address"
            disabled={isLoadingAddress}
            value={formState.address}
            onChange={(event) =>
              dispatchForm({
                type: 'fieldChanged',
                field: 'address',
                value: event.target.value,
              })
            }
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
              checked={formState.priority}
              onChange={(event) =>
                dispatchForm({
                  type: 'priorityChanged',
                  value: event.target.checked,
                })
              }
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
      {formState.errors.address ? <p>{formState.errors.address}</p> : null}
    </div>
  );
}

export default CreateOrder;
