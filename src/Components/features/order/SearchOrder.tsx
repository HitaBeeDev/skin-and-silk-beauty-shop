import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

function SearchOrder(): JSX.Element {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!query) return;
    navigate(ROUTES.ORDER_DETAIL.replace(':orderId', query));
    setQuery('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Search order #"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}

export default SearchOrder;
