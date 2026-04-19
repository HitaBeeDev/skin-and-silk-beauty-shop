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

export {
  createInitialState,
  createOrderFormReducer,
  formFieldIds,
  phoneHint,
  validateForm,
};

export type { CreateOrderFormAction, CreateOrderFormState, FieldName };
