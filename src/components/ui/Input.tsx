import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightElement,
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-semibold text-[#12345B]"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={[
              "h-11 w-full rounded-xl border bg-white",
              "px-3 text-sm text-[#12345B]",
              "placeholder:text-slate-400",
              "outline-none transition-all",
              "focus:border-[#168A52] focus:ring-2 focus:ring-[#168A52]/15",
              error
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-slate-300",
              leftIcon ? "pl-10" : "",
              rightElement ? "pr-11" : "",
              className,
            ].join(" ")}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>

        {error ? (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {error}
          </p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-slate-500">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;