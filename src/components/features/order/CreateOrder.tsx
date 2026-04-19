import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Navigate, useActionData, useNavigation } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import { PRIORITY_DELIVERY_FEE } from "@/constants/pricing";

import {
  getCart,
  getIsCartEmpty,
  getTotalCartPrice,
} from "@/components/features/cart/cartSelectors";
import {
  selectUserAddress,
  selectUserPosition,
  selectUserStatus,
  selectUsername,
} from "@/components/features/user/userSlice";
import CreateOrderForm from "@/components/features/order/CreateOrderForm";
import CreateOrderHeader from "@/components/features/order/CreateOrderHeader";
import MobileOrderSummary from "@/components/features/order/MobileOrderSummary";
import OrderSummary from "@/components/features/order/OrderSummary";
import {
  createInitialState,
  createOrderFormReducer,
} from "@/components/features/order/createOrderFormState";
import Toast from "@/components/ui/Toast";
import { useAppSelector } from "@store/hooks";
import type { CreateOrderActionData } from "@/routes/createOrder.action";

function CreateOrder(): JSX.Element {
  const username = useAppSelector(selectUsername);
  const addressStatus = useAppSelector(selectUserStatus);
  const position = useAppSelector(selectUserPosition);
  const address = useAppSelector(selectUserAddress);
  const cart = useAppSelector(getCart);
  const isCartEmpty = useAppSelector(getIsCartEmpty);
  const totalCartPrice = useAppSelector(getTotalCartPrice);
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
  const priorityPrice = formState.priority ? PRIORITY_DELIVERY_FEE : 0;
  const totalPrice = subtotal + priorityPrice;
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
        <CreateOrderHeader />

        <MobileOrderSummary
          cart={cart}
          isOpen={formState.isSummaryOpen}
          onToggle={() =>
            dispatchForm({
              type: "setSummaryOpen",
              value: !formState.isSummaryOpen,
            })
          }
          priorityPrice={priorityPrice}
          subtotal={subtotal}
          totalPrice={totalPrice}
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.7fr)] lg:items-start">
          <div className="overflow-hidden rounded-[1.1rem] bg-white p-6 shadow-[0_18px_45px_rgba(85,0,0,0.08)] sm:p-7">
            <CreateOrderForm
              addressInputRef={addressInputRef}
              cart={cart}
              dispatchForm={dispatchForm}
              encodedPosition={encodedPosition}
              formState={formState}
              geolocationInlineError={geolocationInlineError}
              isLoadingAddress={isLoadingAddress}
              isSubmitting={isSubmitting}
              totalPrice={totalPrice}
            />
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
