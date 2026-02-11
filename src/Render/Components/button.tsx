import { clsx } from "clsx";
import type React from "react";
import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

/**
 * Button component using Tailwind CSS with theme support
 */
export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled = false,
  children,
  ...props
}) => {
  const baseStyles = clsx(
    "inline-flex items-center justify-center font-medium rounded-lg",
    "transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
  );

  const variantStyles = {
    primary: clsx(
      "bg-[var(--color-accent)] text-white",
      "hover:bg-[var(--color-accent-hover)] active:bg-[var(--color-accent-active)]",
      "focus:ring-[var(--color-accent)]"
    ),
    secondary: clsx(
      "bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]",
      "border border-[var(--color-border)]",
      "hover:bg-[var(--color-bg-secondary)]",
      "focus:ring-[var(--color-accent)]"
    ),
    success: clsx(
      "bg-[var(--color-success)] text-white",
      "hover:opacity-90 active:opacity-80",
      "focus:ring-[var(--color-success)]"
    ),
    danger: clsx(
      "bg-[var(--color-error)] text-white",
      "hover:opacity-90 active:opacity-80",
      "focus:ring-[var(--color-error)]"
    ),
    ghost: clsx(
      "bg-transparent text-[var(--color-text-primary)]",
      "hover:bg-[var(--color-bg-tertiary)]",
      "focus:ring-[var(--color-accent)]"
    ),
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm min-w-[80px]",
    md: "px-4 py-2 text-base min-w-[100px]",
    lg: "px-6 py-3 text-lg min-w-[120px]",
  };

  const buttonClasses = clsx(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    !disabled && !loading && "hover:-translate-y-0.5 active:translate-y-0",
    className
  );

  return (
    <button className={buttonClasses} disabled={disabled || loading} {...props}>
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
