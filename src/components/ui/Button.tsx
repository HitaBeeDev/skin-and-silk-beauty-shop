import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

import Spinner from "@/components/ui/Spinner";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "link";
type ButtonSize = "sm" | "md" | "lg";
type NativeButtonType = "button" | "submit" | "reset";

type BaseButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  className?: string;
};

type ButtonAsButtonProps = BaseButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
    to?: never;
    type?: NativeButtonType;
  };

type ButtonAsLinkProps = BaseButtonProps & {
  to: string;
  type?: never;
  isDisabled?: boolean;
  onClick?: never;
};

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-[#5A4034] bg-[#5A4034] text-white hover:opacity-90 active:scale-[0.99]",
  secondary:
    "border border-[#D4B189] bg-[#F6E6DA] text-[#5A4034] hover:opacity-90 active:scale-[0.99]",
  ghost:
    "border border-zinc-300 bg-transparent text-[#5A4034] hover:bg-[#f8efe7] active:scale-[0.99]",
  danger:
    "border border-[#b42318] bg-[#b42318] text-white hover:opacity-90 active:scale-[0.99]",
  link: "border-none bg-transparent p-0 text-[#5A4034] underline hover:opacity-90",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-base",
  lg: "px-5 py-3.5 text-lg",
};

/**
 * Reusable button primitive for actions and navigational CTAs.
 * Supports variants, sizes, icons, loading state, full-width layout, and
 * an explicit native button type to avoid accidental form submission.
 */
function Button(props: ButtonProps): JSX.Element {
  const {
    children,
    variant = "primary",
    size = "md",
    isLoading = false,
    isFullWidth = false,
    leftIcon,
    rightIcon,
    className = "",
  } = props;

  const sharedClassName = [
    "inline-flex items-center justify-center gap-2 rounded-lg transition-[opacity,transform,background-color] duration-200 ease-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2",
    sizeClasses[size],
    variantClasses[variant],
    isFullWidth ? "w-full" : "",
    isLoading ? "cursor-wait opacity-70" : "cursor-pointer",
    "disabled:cursor-not-allowed disabled:opacity-70",
    className,
  ].join(" ");

  const content = (
    <>
      {isLoading ? <Spinner size={size} /> : leftIcon}
      <span>{children}</span>
      {!isLoading ? rightIcon : null}
    </>
  );

  if ("to" in props && typeof props.to === "string") {
    const { isDisabled, to } = props as ButtonAsLinkProps;

    return (
      <Link aria-disabled={isDisabled} className={sharedClassName} to={to}>
        {content}
      </Link>
    );
  }

  const { type = "button", disabled, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      disabled={disabled || isLoading}
      className={sharedClassName}
      type={type}
    >
      {content}
    </button>
  );
}

export default Button;
