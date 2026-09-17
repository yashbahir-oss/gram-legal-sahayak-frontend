import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { Link, type LinkProps } from "react-router";
import { LoaderCircle } from "lucide-react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

type ButtonSize = "sm" | "md" | "lg";

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

type ButtonProps = BaseButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: never;
  };

type LinkButtonProps = BaseButtonProps &
  Omit<LinkProps, "className" | "children"> & {
    to: string;
  };

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[#12345B] text-white hover:bg-[#0D2948] shadow-sm",

  secondary:
    "bg-[#168A52] text-white hover:bg-[#117442] shadow-sm",

  outline:
    "border border-slate-300 bg-white text-[#12345B] hover:bg-slate-50",

  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-[#12345B]",

  danger:
    "bg-red-600 text-white hover:bg-red-700 shadow-sm",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

function buttonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  className: string,
) {
  return [
    "inline-flex items-center justify-center gap-2",
    "rounded-xl font-semibold",
    "transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-[#168A52]/30",
    "disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  ].join(" ");
}

function ButtonContent({
  loading,
  leftIcon,
  rightIcon,
  children,
}: {
  loading: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <>
      {loading ? (
        <LoaderCircle size={17} className="animate-spin" />
      ) : (
        leftIcon
      )}

      {children}

      {!loading && rightIcon}
    </>
  );
}

const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    leftIcon,
    rightIcon,
    disabled,
    children,
    className = "",
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={buttonClasses(
        variant,
        size,
        className,
      )}
      {...props}
    >
      <ButtonContent
        loading={loading}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
      >
        {children}
      </ButtonContent>
    </button>
  );
});

export function LinkButton({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  to,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      to={to}
      className={buttonClasses(
        variant,
        size,
        className,
      )}
      {...props}
    >
      <ButtonContent
        loading={loading}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
      >
        {children}
      </ButtonContent>
    </Link>
  );
}

Button.displayName = "Button";

export default Button;