import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddings = {
  none: "p-0",
  sm: "p-4",
  md: "p-5",
  lg: "p-6 sm:p-7",
};

export default function Card({
  children,
  hover = false,
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "rounded-2xl border border-slate-200 bg-white",
        "shadow-[0_1px_3px_rgba(15,23,42,0.04)]",
        paddings[padding],
        hover
          ? "transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}