import { useEffect, useReducer, useRef, useState } from 'react';
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
  selectUserError,
  selectUserPosition,
  selectUserStatus,
  selectUsername,
} from '@/components/features/user/userSlice';
import Spinner from '@/components/ui/Spinner';
import { formatCurrency } from '@/components/utils/helpers';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import type { CreateOrderActionData } from '@/routes/createOrder.action';

const fieldErrorStyle = { color: '#b42318' } as const;

const phoneHint = 'e.g. +1 555 000 0000';

const isValidPhone = (value: string): boolean =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    value
  );

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
    customer: validateField('customer', state.customer),
    phone: validateField('phone', state.phone),
    address: validateField('address', state.address),
  };
}

function validateField(
  field: 'customer' | 'phone' | 'address',
  value: string
): string | undefined {
  const trimmedValue = value.trim();

  if (field === 'customer') {
    return trimmedValue ? undefined : 'Please enter your first name.';
  }

  if (field === 'address') {
    return trimmedValue ? undefined : 'Please enter your address.';
  }

  if (!trimmedValue) {
    return 'Please enter your phone number.';
  }

  return isValidPhone(trimmedValue)
    ? undefined
    : 'Please give us your correct phone number. We might need it to contact you.';
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
  const addressError = useAppSelector(selectUserError);
  const position = useAppSelector(selectUserPosition);
  const address = useAppSelector(selectUserAddress);
  const isLoadingAddress = addressStatus === 'loading';
  const isAddressLookupFailed = addressStatus === 'failed';
  const isGeolocationFailure = addressError.includes('Could not detect location');
  const isGeocodingFailure = addressError.includes('Could not look up your address');

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const formErrors = useActionData() as CreateOrderActionData | undefined;
  const dispatch = useAppDispatch();
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const [formState, dispatchForm] = useReducer(
    createOrderFormReducer,
    createInitialState(username, address)
  );
  const [isGeocodingErrorVisible, setIsGeocodingErrorVisible] = useState(true);

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

  useEffect(() => {
    if (!isGeolocationFailure) return;

    addressInputRef.current?.focus();
  }, [isGeolocationFailure]);

  useEffect(() => {
    if (isGeocodingFailure) {
      setIsGeocodingErrorVisible(true);
    }
  }, [isGeocodingFailure]);

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
          onBlur={(event) =>
            dispatchForm({
              type: 'setFieldError',
              field: 'customer',
              error: validateField('customer', event.target.value),
            })
          }
          required
          placeholder="Enter your first name"
        />
        {formState.errors.customer ? (
          <p style={fieldErrorStyle}>{formState.errors.customer}</p>
        ) : null}

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
          onBlur={(event) =>
            dispatchForm({
              type: 'setFieldError',
              field: 'phone',
              error: validateField('phone', event.target.value),
            })
          }
          required
          placeholder={phoneHint}
        />
        <p>{phoneHint}</p>
        {formState.errors.phone ? (
          <p style={fieldErrorStyle}>{formState.errors.phone}</p>
        ) : null}

        {/* Address */}
        <label>
          Address
        </label>
        <div>
          <input
            ref={addressInputRef}
            type="text"
            name="address"
            value={formState.address}
            onChange={(event) =>
              dispatchForm({
                type: 'fieldChanged',
                field: 'address',
                value: event.target.value,
                })
              }
            onBlur={(event) =>
              dispatchForm({
                type: 'setFieldError',
                field: 'address',
                error: validateField('address', event.target.value),
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
        {isAddressLookupFailed && isGeolocationFailure ? (
          <p style={fieldErrorStyle}>Couldn&apos;t detect location — enter address manually</p>
        ) : null}
        {isAddressLookupFailed && isGeocodingFailure && isGeocodingErrorVisible ? (
          <div>
            <p style={fieldErrorStyle}>Couldn&apos;t look up your address right now. Enter it manually if needed.</p>
            <button type="button" onClick={() => setIsGeocodingErrorVisible(false)}>
              Dismiss
            </button>
          </div>
        ) : null}
        {formState.errors.address ? (
          <p style={fieldErrorStyle}>{formState.errors.address}</p>
        ) : null}

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
              {isSubmitting ? (
                <>
                  <Spinner label="Placing order" size="sm" />
                  <span>Placing order...</span>
                </>
              ) : (
                `Order now from ${formatCurrency(totalPrice)}`
              )}
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default CreateOrder;
