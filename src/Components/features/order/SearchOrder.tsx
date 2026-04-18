import { type FormEvent, useDeferredValue, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

import { selectOrders } from '@/components/features/order/ordersSlice';
import LinkButton from '@/components/ui/LinkButton';
import { useAppSelector } from '@store/hooks';

type SearchOrderProps = {
  autoFocus?: boolean;
  compact?: boolean;
  initialQuery?: string;
  invalidFormatMessage?: string;
  missingOrderMessage?: string;
  title?: string;
};

export function isValidOrderId(value: string): boolean {
  return /^ord_\d{5,}$/.test(value.trim());
}

function SearchOrder({
  autoFocus = false,
  compact = false,
  initialQuery = '',
  invalidFormatMessage = 'Use an order ID like ord_1234567890.',
  missingOrderMessage,
  title = 'Look up another order',
}: SearchOrderProps): JSX.Element {
  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [formatError, setFormatError] = useState('');
  const deferredQuery = useDeferredValue(query);
  const navigate = useNavigate();
  const orders = useAppSelector(selectOrders);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const normalizedDeferredQuery = deferredQuery.trim();
  const normalizedSubmittedQuery = submittedQuery.trim();
  const hasOrders = orders.length > 0;
  const hasMatch = normalizedSubmittedQuery
    ? orders.some((order) => order.id === normalizedSubmittedQuery)
    : false;
  const showMissingOrderState =
    Boolean(normalizedSubmittedQuery) && !formatError && !hasMatch;

  useEffect(() => {
    setQuery(initialQuery);
    setSubmittedQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (!autoFocus) return;

    inputRef.current?.focus();
  }, [autoFocus]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextQuery = normalizedDeferredQuery || query.trim();
    if (!nextQuery) return;

    setSubmittedQuery(nextQuery);

    if (!isValidOrderId(nextQuery)) {
      setFormatError(invalidFormatMessage);
      return;
    }

    setFormatError('');

    if (!orders.some((order) => order.id === nextQuery)) {
      return;
    }

    navigate(ROUTES.ORDER_DETAIL.replace(':orderId', nextQuery));
    setQuery('');
    setSubmittedQuery('');
  }

  return (
    <div className={compact ? 'rounded-[1.75rem] border border-[#ead9ca] bg-[#fffaf5] p-5 shadow-[0_20px_50px_-40px_rgba(36,25,21,0.34)]' : ''}>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <label
            className="font-['Quicksand',sans-serif] text-sm font-semibold text-[#5a4034]"
            htmlFor="order-search"
          >
            {title}
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              id="order-search"
              ref={inputRef}
              className="w-full rounded-2xl border border-[#d9c0ae] bg-white px-4 py-3 font-['Quicksand',sans-serif] text-base text-[#241915] outline-none transition-[border-color,box-shadow] duration-200 ease-in placeholder:text-[#9c8f8f] focus:border-[#5a4034] focus:ring-2 focus:ring-[#5a4034]/20"
              placeholder="ord_1234567890"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (formatError) {
                  setFormatError('');
                }
              }}
            />
            <button
              className="inline-flex items-center justify-center rounded-2xl border border-[#5a4034] bg-[#5a4034] px-5 py-3 font-['Quicksand',sans-serif] text-sm font-semibold text-white transition-[opacity,transform] duration-200 ease-in hover:opacity-90 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
              type="submit"
            >
              Find Order
            </button>
          </div>
        </div>
      </form>

      {formatError ? (
        <p className="mt-3 text-sm text-[#b42318]" role="alert">
          {formatError}
        </p>
      ) : null}

      {!hasOrders ? (
        <div className="mt-4">
          <p className="text-sm text-[#5b463d]">No orders yet</p>
          <div className="mt-2">
            <LinkButton to={ROUTES.PRODUCTS}>Start Shopping</LinkButton>
          </div>
        </div>
      ) : null}

      {showMissingOrderState ? (
        <div className="mt-4 space-y-1">
          <p className="text-sm text-[#b42318]" role="alert">
            {missingOrderMessage ?? `No order found for ${normalizedSubmittedQuery}.`}
          </p>
          <p className="text-sm text-[#5b463d]">
            Check that the order ID uses the expected format, for example `ord_1234567890`.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default SearchOrder;
