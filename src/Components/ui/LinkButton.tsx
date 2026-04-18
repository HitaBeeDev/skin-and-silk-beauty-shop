import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type LinkButtonProps = {
  children: ReactNode;
  to: string;
};

function LinkButton({ children, to }: LinkButtonProps): JSX.Element {
  const navigate = useNavigate();

  if (to === '-1')
    return (
      <button
        className="rounded-md px-2 py-1 text-[#5A4034] underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
        onClick={() => navigate(-1)}
        type="button"
      >
        {children}
      </button>
    );

  return (
    <Link
      className="rounded-md px-2 py-1 text-[#5A4034] underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
      to={to}
    >
      {children}
    </Link>
  );
}

export default LinkButton;
