import type { MouseEventHandler, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'small' | 'round' | 'secondary';

type ButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  to?: string;
  type: ButtonVariant;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

function Button({
  children,
  disabled,
  to,
  type: _type,
  onClick,
}: ButtonProps): JSX.Element {
  if (to) return <Link to={to}>{children}</Link>;

  if (onClick)
    return (
      <button onClick={onClick} disabled={disabled}>
        {children}
      </button>
    );

  return (
    <button disabled={disabled} type="button">
      {children}
    </button>
  );
}

export default Button;
