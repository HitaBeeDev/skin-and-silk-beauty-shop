import type { Dispatch, RefObject } from "react";
import { Form } from "react-router-dom";

import type { CartItem } from "@/types";

import { PRIORITY_DELIVERY_FEE } from "@/constants/pricing";

import { fetchAddress } from "@/components/features/user/userSlice";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { formatCurrency } from "@/components/utils/helpers";
import type {
  CreateOrderFormAction,
  CreateOrderFormState,
} from "@/components/features/order/createOrderFormState";
import {
  phoneHint,
  validateForm,
} from "@/components/features/order/createOrderFormState";
import { useAppDispatch } from "@store/hooks";

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

type CreateOrderFormProps = {
  cart: CartItem[];
  encodedPosition: string;
  formState: CreateOrderFormState;
  isLoadingAddress: boolean;
  isSubmitting: boolean;
  totalPrice: number;
  geolocationInlineError: string;
  addressInputRef: RefObject<HTMLTextAreaElement>;
  dispatchForm: Dispatch<CreateOrderFormAction>;
};

function CreateOrderForm({
  cart,
  encodedPosition,
  formState,
  isLoadingAddress,
  isSubmitting,
  totalPrice,
  geolocationInlineError,
  addressInputRef,
  dispatchForm,
}: CreateOrderFormProps): JSX.Element {
  const dispatch = useAppDispatch();
  const hasVisibleErrors = Object.values(formState.errors).some(Boolean);

  return (
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
          className="rounded-[1rem] border border-[#b42318]/30 bg-[#fff5f5] px-4 py-3 text-sm text-[#b42318]"
          role="alert"
        >
          Please correct the highlighted fields before submitting.
        </div>
      ) : null}

      <div className="space-y-2">
        <label
          className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#550000]"
          htmlFor="customer"
        >
          Full name
        </label>
        <input
          className={[
            "w-full rounded-[1rem] border bg-white px-4 py-3 font-['Quicksand',sans-serif] text-base text-[#241915] outline-none transition-[border-color,box-shadow,opacity] duration-200 ease-in placeholder:text-[#550000]/30",
            formState.errors.customer ? "border-[#b42318]" : "border-[#550000]/20",
            "focus:border-[#8c1d40] focus:ring-2 focus:ring-[#8c1d40]/15",
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
            "w-full rounded-[1rem] border bg-white px-4 py-3 font-['Quicksand',sans-serif] text-base text-[#241915] outline-none transition-[border-color,box-shadow,opacity] duration-200 ease-in placeholder:text-[#550000]/30",
            formState.errors.phone ? "border-[#b42318]" : "border-[#550000]/20",
            "focus:border-[#8c1d40] focus:ring-2 focus:ring-[#8c1d40]/15",
          ].join(" ")}
          id="phone"
          name="phone"
          onBlur={() => dispatchForm({ type: "fieldBlurred", field: "phone" })}
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
        <p className="text-sm text-[#8c1d40]/60">{phoneHint}</p>
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
              "min-h-32 w-full rounded-[1rem] border px-4 py-3 font-['Quicksand',sans-serif] text-base text-[#241915] outline-none transition-[border-color,box-shadow,background-color,opacity] duration-200 ease-in placeholder:text-[#550000]/30",
              formState.errors.address ? "border-[#b42318]" : "border-[#550000]/20",
              formState.autofilledAddress ? "bg-[#fff0f2]" : "bg-white",
              "focus:border-[#8c1d40] focus:ring-2 focus:ring-[#8c1d40]/15",
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
            className="self-start rounded-full border-[#550000]/20 text-[0.78rem] text-[#550000] hover:bg-[#fff0f0]"
            disabled={isLoadingAddress}
            leftIcon={isLoadingAddress ? <Spinner size="sm" /> : <MapPinIcon />}
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

      <div className="rounded-[1.1rem] border border-[#550000]/10 bg-[#fff0f2] p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#550000]">
              Priority delivery
            </p>
            <p className="mt-1 text-sm text-[#8c1d40]/70">
              Add {formatCurrency(PRIORITY_DELIVERY_FEE)} for priority delivery.
            </p>
          </div>
          <button
            aria-checked={formState.priority}
            className={[
              "relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 ease-in",
              formState.priority ? "bg-[#550000]" : "bg-[#550000]/20",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8c1d40] focus-visible:ring-offset-2",
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
        className="!rounded-full !border-0 !bg-[#550000] !text-white hover:!bg-[#6e0000]"
        disabled={isSubmitting || isLoadingAddress}
        isFullWidth
        isLoading={isSubmitting}
        size="lg"
        type="submit"
      >
        {isSubmitting
          ? "Placing order..."
          : `Order now — ${formatCurrency(totalPrice)}`}
      </Button>
    </Form>
  );
}

export default CreateOrderForm;
