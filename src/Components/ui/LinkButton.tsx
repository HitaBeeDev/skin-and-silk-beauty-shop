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
      <button onClick={() => navigate(-1)} type="button">
        {children}
      </button>
    );

  return <Link to={to}>{children}</Link>;
}

export default LinkButton;
