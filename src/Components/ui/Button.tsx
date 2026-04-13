import type {
  ButtonHTMLAttributes,
  CSSProperties,
  ReactNode,
} from 'react';
import { Link } from 'react-router-dom';

import Spinner from '@/Components/ui/Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';
type NativeButtonType = 'button' | 'submit' | 'reset';

type BaseButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
};

type ButtonAsButtonProps = BaseButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
    to?: never;
    type?: NativeButtonType;
  };

type ButtonAsLinkProps = BaseButtonProps & {
  to: string;
  type?: never;
  disabled?: boolean;
  onClick?: never;
};

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    backgroundColor: '#5A4034',
    color: '#fff',
    border: '1px solid #5A4034',
  },
  secondary: {
    backgroundColor: '#F6E6DA',
    color: '#5A4034',
    border: '1px solid #D4B189',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#5A4034',
    border: '1px solid #d6d6d6',
  },
  danger: {
    backgroundColor: '#b42318',
    color: '#fff',
    border: '1px solid #b42318',
  },
  link: {
    backgroundColor: 'transparent',
    color: '#5A4034',
    border: 'none',
    textDecoration: 'underline',
    padding: 0,
  },
};

const sizeStyles: Record<ButtonSize, CSSProperties> = {
  sm: {
    fontSize: '0.875rem',
    padding: '0.5rem 0.75rem',
  },
  md: {
    fontSize: '1rem',
    padding: '0.65rem 1rem',
  },
  lg: {
    fontSize: '1.125rem',
    padding: '0.85rem 1.25rem',
  },
};

/**
 * Reusable button primitive for actions and navigational CTAs.
 * Supports variants, sizes, icons, loading state, full-width layout, and
 * an explicit native button type to avoid accidental form submission.
 */
function Button(props: ButtonProps): JSX.Element {
  const {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
  } = props;

  const sharedStyle: CSSProperties = {
    ...sizeStyles[size],
    ...variantStyles[variant],
    width: fullWidth ? '100%' : undefined,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    borderRadius: '0.5rem',
    cursor: loading ? 'wait' : 'pointer',
    opacity: loading || ('disabled' in props && props.disabled) ? 0.7 : 1,
    textDecoration: variant === 'link' ? 'underline' : 'none',
  };

  const content = (
    <>
      {loading ? <Spinner size={size} /> : leftIcon}
      <span>{children}</span>
      {!loading ? rightIcon : null}
    </>
  );

  if ('to' in props) {
    return (
      <Link
        aria-disabled={props.disabled}
        style={sharedStyle}
        to={props.to as string}
      >
        {content}
      </Link>
    );
  }

  const { type = 'button', disabled, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      disabled={disabled || loading}
      style={sharedStyle}
      type={type}
    >
      {content}
    </button>
  );
}

export default Button;
