import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Form, Navigate, useActionData, useNavigation } from "react-router-dom";

import { ROUTES } from "@/constants/routes";

import type { CartItem } from "@/types";

import {
  getCart,
  getIsCartEmpty,
  getTotalCartPrice,
} from "@/components/features/cart/cartSelectors";
import {
  fetchAddress,
  selectUserAddress,
  selectUserPosition,
  selectUserStatus,
  selectUsername,
} from "@/components/features/user/userSlice";
import Button from "@/components/ui/Button";
import LinkButton from "@/components/ui/LinkButton";
import Spinner from "@/components/ui/Spinner";
import Toast from "@/components/ui/Toast";
import { formatCurrency } from "@/components/utils/helpers";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import type { CreateOrderActionData } from "@/routes/createOrder.action";

const phoneHint = "e.g. +1 555 000 0000";
const formFieldIds = ["customer", "phone", "address"] as const;

type FieldName = (typeof formFieldIds)[number];

type CreateOrderFormState = {
  customer: string;
  phone: string;
  address: string;
  priority: boolean;
  touched: Record<FieldName, boolean>;
  errors: Partial<Record<FieldName, string>>;
  isSummaryOpen: boolean;
  autofilledAddress: boolean;
};

type CreateOrderFormAction =
  | {
      type: "fieldChanged";
      field: FieldName;
      value: string;
      revalidate: boolean;
    }
  | { type: "fieldBlurred"; field: FieldName }
  | { type: "priorityChanged"; value: boolean }
  | { type: "setErrors"; errors: CreateOrderFormState["errors"] }
  | { type: "markAllTouched" }
  | {
      type: "syncDefaults";
      payload: Partial<Pick<CreateOrderFormState, "customer" | "address">>;
    }
  | { type: "autofillAddress"; value: string }
  | { type: "setSummaryOpen"; value: boolean }
  | { type: "clearAutofillFlash" };

const isValidPhone = (value: string): boolean =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    value,
  );

function validateField(field: FieldName, value: string): string | undefined {
  const trimmedValue = value.trim();

  if (field === "customer") {
    return trimmedValue ? undefined : "Please enter your full name.";
  }

  if (field === "address") {
    return trimmedValue ? undefined : "Please enter your delivery address.";
  }

  if (!trimmedValue) {
    return "Please enter your phone number.";
  }

  return isValidPhone(trimmedValue)
    ? undefined
    : "Please use a valid phone number so we can reach you about delivery.";
}

function validateForm(
  state: Pick<CreateOrderFormState, FieldName>,
): CreateOrderFormState["errors"] {
  return {
    customer: validateField("customer", state.customer),
    phone: validateField("phone", state.phone),
    address: validateField("address", state.address),
  };
}

function createInitialState(
  customer: string,
  address: string,
): CreateOrderFormState {
  return {
    customer,
    phone: "",
    address,
    priority: false,
    touched: {
      customer: false,
      phone: false,
      address: false,
    },
    errors: {},
    isSummaryOpen: false,
    autofilledAddress: false,
  };
}

function createOrderFormReducer(
  state: CreateOrderFormState,
  action: CreateOrderFormAction,
): CreateOrderFormState {
  switch (action.type) {
    case "fieldChanged": {
      const nextState = {
        ...state,
        [action.field]: action.value,
      };

      return {
        ...nextState,
        autofilledAddress:
          action.field === "address" ? false : state.autofilledAddress,
        errors: {
          ...state.errors,
          [action.field]: action.revalidate
            ? validateField(action.field, action.value)
            : state.errors[action.field],
        },
      };
    }
    case "fieldBlurred":
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.field]: true,
        },
        errors: {
          ...state.errors,
          [action.field]: validateField(action.field, state[action.field]),
        },
      };
    case "priorityChanged":
      return {
        ...state,
        priority: action.value,
      };
    case "setErrors":
      return {
        ...state,
        errors: action.errors,
      };
    case "markAllTouched":
      return {
        ...state,
        touched: {
          customer: true,
          phone: true,
          address: true,
        },
      };
    case "syncDefaults":
      return {
        ...state,
        customer: state.customer || action.payload.customer || "",
        address: state.address || action.payload.address || "",
      };
    case "autofillAddress":
      return {
        ...state,
        address: action.value,
        autofilledAddress: true,
        touched: {
          ...state.touched,
          address: true,
        },
        errors: {
          ...state.errors,
          address: validateField("address", action.value),
        },
      };
    case "setSummaryOpen":
      return {
        ...state,
        isSummaryOpen: action.value,
      };
    case "clearAutofillFlash":
      return {
        ...state,
        autofilledAddress: false,
      };
    default:
      return state;
  }
}

function MapPinIcon(): JSX.Element {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 21s6-5.6 6-11a6 6 0 10-12 0c0 5.4 6 11 6 11z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

type OrderSummaryProps = {
  cart: CartItem[];
  subtotal: number;
  priorityPrice: number;
  totalPrice: number;
};

function OrderSummary({
  cart,
  subtotal,
  priorityPrice,
  totalPrice,
}: OrderSummaryProps): JSX.Element {
  return (
    <div className="space-y-5 rounded-[2rem] border border-[#ead9ca] bg-[#fffaf5] p-6 shadow-[0_24px_60px_-44px_rgba(36,25,21,0.34)]">
      <div>
        <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.24em] text-[#8c6659]">
          Order Summary
        </p>
      </div>

      <ul className="space-y-3">
        {cart.map((item) => (
          <li
            key={item.productId}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 text-sm text-[#4d3932]"
          >
            <span>
              {item.name}{" "}
              <span className="text-[#8c6659]">× {item.quantity}</span>
            </span>
            <span className="font-semibold text-[#241915]">
              {formatCurrency(item.totalPrice)}
            </span>
          </li>
        ))}
      </ul>

      <div className="space-y-3 border-t border-[#ead9ca] pt-4 text-sm text-[#4d3932]">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {priorityPrice > 0 ? (
          <div className="flex items-center justify-between">
            <span>+{formatCurrency(priorityPrice)} for priority delivery</span>
            <span>{formatCurrency(priorityPrice)}</span>
          </div>
        ) : null}
        <div className="flex items-center justify-between text-lg font-semibold text-[#241915]">
          <span>Total</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}

function CreateOrder(): JSX.Element {
  const username = useAppSelector(selectUsername);
  const addressStatus = useAppSelector(selectUserStatus);
  const position = useAppSelector(selectUserPosition);
  const address = useAppSelector(selectUserAddress);
  const cart = useAppSelector(getCart);
  const isCartEmpty = useAppSelector(getIsCartEmpty);
  const totalCartPrice = useAppSelector(getTotalCartPrice);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const actionData = useActionData() as CreateOrderActionData | undefined;
  const addressInputRef = useRef<HTMLTextAreaElement | null>(null);
  const [isErrorToastOpen, setIsErrorToastOpen] = useState(false);
  const [formState, dispatchForm] = useReducer(
    createOrderFormReducer,
    createInitialState(username, address),
  );

  const isSubmitting = navigation.state === "submitting";
  const isLoadingAddress = addressStatus === "loading";
  const subtotal = totalCartPrice;
  const priorityPrice = formState.priority ? subtotal * 0.2 : 0;
  const totalPrice = subtotal + priorityPrice;
  const hasVisibleErrors = formFieldIds.some((field) =>
    Boolean(formState.errors[field]),
  );
  const geolocationInlineError =
    addressStatus === "failed"
      ? "Couldn't detect your location — enter address manually"
      : "";

  useEffect(() => {
    dispatchForm({
      type: "syncDefaults",
      payload: {
        customer: username,
        address,
      },
    });
  }, [address, username]);

  useEffect(() => {
    if (!address) return;

    dispatchForm({ type: "autofillAddress", value: address });
  }, [address]);

  useEffect(() => {
    if (!formState.autofilledAddress) return;

    const timeoutId = window.setTimeout(() => {
      dispatchForm({ type: "clearAutofillFlash" });
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [formState.autofilledAddress]);

  useEffect(() => {
    if (!actionData?.formError) return;

    setIsErrorToastOpen(true);
  }, [actionData?.formError]);

  useEffect(() => {
    if (!actionData?.phone) return;

    dispatchForm({ type: "markAllTouched" });
    dispatchForm({
      type: "setErrors",
      errors: {
        ...formState.errors,
        phone: actionData.phone,
      },
    });
  }, [actionData?.phone, formState.errors]);

  useEffect(() => {
    if (!geolocationInlineError) return;

    addressInputRef.current?.focus();
  }, [geolocationInlineError]);

  const encodedPosition = useMemo(() => {
    if (!position.latitude || !position.longitude) {
      return "";
    }

    return `${position.latitude},${position.longitude}`;
  }, [position.latitude, position.longitude]);

  if (isCartEmpty) {
    return <Navigate replace to={ROUTES.PRODUCTS} />;
  }

  return (
    <section className="mx-auto w-[min(100%-2rem,72rem)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        <LinkButton to={ROUTES.CART}>&larr; Back to cart</LinkButton>

        <div className="max-w-2xl">
          <p className="font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.28em] text-[#8c6659]">
            Checkout
          </p>
          <h1 className="mt-3 font-['Playfair_Display',serif] text-4xl text-[#5a4034] sm:text-5xl">
            Confirm your delivery details.
          </h1>
        </div>

        <div className="lg:hidden">
          <div className="rounded-[2rem] border border-[#ead9ca] bg-[#fffaf5] shadow-[0_24px_60px_-44px_rgba(36,25,21,0.34)]">
            <button
              aria-expanded={formState.isSummaryOpen}
              className="flex w-full items-center justify-between px-5 py-4 text-left font-['Quicksand',sans-serif] text-sm font-semibold uppercase tracking-[0.2em] text-[#5a4034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
              onClick={() =>
                dispatchForm({
                  type: "setSummaryOpen",
                  value: !formState.isSummaryOpen,
                })
              }
              type="button"
            >
              <span>Order Summary</span>
              <span>{formState.isSummaryOpen ? "Hide" : "Show"}</span>
            </button>
            {formState.isSummaryOpen ? (
              <div className="px-5 pb-5">
                <OrderSummary
                  cart={cart}
                  priorityPrice={priorityPrice}
                  subtotal={subtotal}
                  totalPrice={totalPrice}
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.7fr)] lg:items-start">
          <div className="max-w-lg">
            <Form
              className="space-y-6"
              method="POST"
              onSubmit={(event) => {
                const nextErrors = validateForm(formState);
                const hasErrors = Object.values(nextErrors).some(Boolean);

                if (!hasErrors) return;

                event.preventDefault();
                dispatchForm({ type: "markAllTouched" });
                dispatchForm({ type: "setErrors", errors: nextErrors });
              }}
            >
              {hasVisibleErrors ? (
                <div
                  aria-live="assertive"
                  className="rounded-2xl border border-[#efb4b4] bg-[#fff5f5] px-4 py-3 text-sm text-[#b42318]"
                  role="alert"
                >
                  Please correct the highlighted fields before submitting.
                </div>
              ) : null}

              <div className="space-y-2">
                <label
                  className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#5a4034]"
                  htmlFor="customer"
                >
                  Full name
                </label>
                <input
                  className={[
                    "w-full rounded-2xl border bg-white px-4 py-3 font-['Quicksand',sans-serif] text-base text-[#241915] outline-none transition-[border-color,box-shadow,opacity] duration-200 ease-in placeholder:text-[#9c8f8f]",
                    formState.errors.customer
                      ? "border-[#b42318]"
                      : "border-[#d9c0ae]",
                    "focus:border-[#5a4034] focus:ring-2 focus:ring-[#5a4034]/20",
                  ].join(" ")}
                  id="customer"
                  name="customer"
                  onBlur={() =>
                    dispatchForm({ type: "fieldBlurred", field: "customer" })
                  }
                  onChange={(event) =>
                    dispatchForm({
                      type: "fieldChanged",
                      field: "customer",
                      value: event.target.value,
                      revalidate: formState.touched.customer,
                    })
                  }
                  placeholder="Enter your full name"
                  required
                  type="text"
                  value={formState.customer}
                />
                <p
                  className={`text-sm text-[#b42318] transition-opacity duration-200 ease-in ${formState.errors.customer ? "opacity-100" : "opacity-0"}`}
                  role={formState.errors.customer ? "alert" : undefined}
                >
                  {formState.errors.customer ?? " "}
                </p>
              </div>

              <div className="space-y-2">
                <label
                  className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#5a4034]"
                  htmlFor="phone"
                >
                  Phone number
                </label>
                <input
                  className={[
                    "w-full rounded-2xl border bg-white px-4 py-3 font-['Quicksand',sans-serif] text-base text-[#241915] outline-none transition-[border-color,box-shadow,opacity] duration-200 ease-in placeholder:text-[#9c8f8f]",
                    formState.errors.phone
                      ? "border-[#b42318]"
                      : "border-[#d9c0ae]",
                    "focus:border-[#5a4034] focus:ring-2 focus:ring-[#5a4034]/20",
                  ].join(" ")}
                  id="phone"
                  name="phone"
                  onBlur={() =>
                    dispatchForm({ type: "fieldBlurred", field: "phone" })
                  }
                  onChange={(event) =>
                    dispatchForm({
                      type: "fieldChanged",
                      field: "phone",
                      value: event.target.value,
                      revalidate: formState.touched.phone,
                    })
                  }
                  placeholder={phoneHint}
                  required
                  type="tel"
                  value={formState.phone}
                />
                <p className="text-sm text-[#8c6659]">{phoneHint}</p>
                <p
                  className={`text-sm text-[#b42318] transition-opacity duration-200 ease-in ${formState.errors.phone ? "opacity-100" : "opacity-0"}`}
                  role={formState.errors.phone ? "alert" : undefined}
                >
                  {formState.errors.phone ?? " "}
                </p>
              </div>

              <div className="space-y-2">
                <label
                  className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#5a4034]"
                  htmlFor="address"
                >
                  Delivery address
                </label>
                <div className="flex flex-col gap-3">
                  <textarea
                    className={[
                      "min-h-32 w-full rounded-2xl border px-4 py-3 font-['Quicksand',sans-serif] text-base text-[#241915] outline-none transition-[border-color,box-shadow,background-color,opacity] duration-200 ease-in placeholder:text-[#9c8f8f]",
                      formState.errors.address
                        ? "border-[#b42318]"
                        : "border-[#d9c0ae]",
                      formState.autofilledAddress ? "bg-[#f6e6da]" : "bg-white",
                      "focus:border-[#5a4034] focus:ring-2 focus:ring-[#5a4034]/20",
                    ].join(" ")}
                    id="address"
                    name="address"
                    onBlur={() =>
                      dispatchForm({ type: "fieldBlurred", field: "address" })
                    }
                    onChange={(event) =>
                      dispatchForm({
                        type: "fieldChanged",
                        field: "address",
                        value: event.target.value,
                        revalidate: formState.touched.address,
                      })
                    }
                    placeholder="Enter your address"
                    ref={addressInputRef}
                    required
                    value={formState.address}
                  />
                  <Button
                    className="self-start"
                    disabled={isLoadingAddress}
                    leftIcon={
                      isLoadingAddress ? <Spinner size="sm" /> : <MapPinIcon />
                    }
                    onClick={() => {
                      void dispatch(fetchAddress());
                    }}
                    type="button"
                    variant="ghost"
                  >
                    Use my location
                  </Button>
                </div>
                {geolocationInlineError ? (
                  <p className="text-sm text-[#b42318]" role="alert">
                    {geolocationInlineError}
                  </p>
                ) : null}
                <p
                  className={`text-sm text-[#b42318] transition-opacity duration-200 ease-in ${formState.errors.address ? "opacity-100" : "opacity-0"}`}
                  role={formState.errors.address ? "alert" : undefined}
                >
                  {formState.errors.address ?? " "}
                </p>
              </div>

              <div className="rounded-[2rem] border border-[#ead9ca] bg-[#fffaf5] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#5a4034]">
                      Priority delivery
                    </p>
                    <p className="mt-1 text-sm text-[#6a5147]">
                      Add {formatCurrency(subtotal * 0.2)} for priority
                      delivery.
                    </p>
                  </div>
                  <button
                    aria-checked={formState.priority}
                    className={[
                      "relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 ease-in",
                      formState.priority ? "bg-[#5a4034]" : "bg-[#d9c0ae]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a4034] focus-visible:ring-offset-2",
                    ].join(" ")}
                    onClick={() =>
                      dispatchForm({
                        type: "priorityChanged",
                        value: !formState.priority,
                      })
                    }
                    role="switch"
                    type="button"
                  >
                    <span
                      className={`inline-block h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in ${formState.priority ? "translate-x-7" : "translate-x-1"}`}
                    />
                  </button>
                </div>
                <input
                  checked={formState.priority}
                  hidden
                  name="priority"
                  readOnly
                  type="checkbox"
                  value="true"
                />
              </div>

              <input name="cart" type="hidden" value={JSON.stringify(cart)} />
              <input name="position" type="hidden" value={encodedPosition} />

              <Button
                disabled={isSubmitting || isLoadingAddress}
                isFullWidth
                isLoading={isSubmitting}
                size="lg"
                type="submit"
              >
                {isSubmitting
                  ? "Placing order..."
                  : `Order now from ${formatCurrency(totalPrice)}`}
              </Button>
            </Form>
          </div>

          <aside className="hidden lg:block lg:sticky lg:top-28">
            <OrderSummary
              cart={cart}
              priorityPrice={priorityPrice}
              subtotal={subtotal}
              totalPrice={totalPrice}
            />
          </aside>
        </div>
      </div>

      <Toast
        duration={4000}
        isOpen={isErrorToastOpen}
        message={
          actionData?.formError ?? "We could not place your order right now."
        }
        onClose={() => setIsErrorToastOpen(false)}
        position="bottom-right"
        tone="error"
      />
    </section>
  );
}

export default CreateOrder;
