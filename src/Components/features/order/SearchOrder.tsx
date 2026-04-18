import { type FormEvent, useDeferredValue, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

import { selectOrders } from '@/components/features/order/ordersSlice';
import LinkButton from '@/components/ui/LinkButton';
import { useAppSelector } from '@store/hooks';

function SearchOrder(): JSX.Element {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const navigate = useNavigate();
  const orders = useAppSelector(selectOrders);
  const normalizedDeferredQuery = deferredQuery.trim();
  const normalizedSubmittedQuery = submittedQuery.trim();
  const hasOrders = orders.length > 0;
  const hasMatch = normalizedSubmittedQuery
    ? orders.some((order) => order.id === normalizedSubmittedQuery)
    : false;
  const showMissingOrderState = Boolean(normalizedSubmittedQuery) && !hasMatch;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextQuery = normalizedDeferredQuery || query.trim();
    if (!nextQuery) return;
    setSubmittedQuery(nextQuery);

    if (!orders.some((order) => order.id === nextQuery)) {
      return;
    }

    navigate(ROUTES.ORDER_DETAIL.replace(':orderId', nextQuery));
    setQuery('');
    setSubmittedQuery('');
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Search order #"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Find Order</button>
      </form>

      {!hasOrders ? (
        <div>
          <p>No orders yet</p>
          <LinkButton to={ROUTES.PRODUCTS}>Start Shopping</LinkButton>
        </div>
      ) : null}

      {normalizedDeferredQuery ? <p>Ready to open order #{normalizedDeferredQuery}</p> : null}

      {showMissingOrderState ? (
        <div>
          <p>No order found for {normalizedSubmittedQuery}</p>
          <p>Check that the order ID uses the expected format, for example `ord_1234567890`.</p>
        </div>
      ) : null}
    </div>
  );
}

export default SearchOrder;
