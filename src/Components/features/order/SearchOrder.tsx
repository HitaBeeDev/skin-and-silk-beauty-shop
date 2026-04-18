import { type FormEvent, useDeferredValue, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

function SearchOrder(): JSX.Element {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const navigate = useNavigate();
  const normalizedDeferredQuery = deferredQuery.trim();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextQuery = normalizedDeferredQuery || query.trim();
    if (!nextQuery) return;
    navigate(ROUTES.ORDER_DETAIL.replace(':orderId', nextQuery));
    setQuery('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Search order #"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {normalizedDeferredQuery ? <p>Ready to open order #{normalizedDeferredQuery}</p> : null}
    </form>
  );
}

export default SearchOrder;
