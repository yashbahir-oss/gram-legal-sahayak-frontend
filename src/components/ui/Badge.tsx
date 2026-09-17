import type { ReactNode } from "react";

type BadgeVariant =
  | "green"
  | "blue"
  | "yellow"
  | "red"
  | "gray";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  icon?: ReactNode;
}

const variants: Record<BadgeVariant, string> = {
  green: "bg-[#EAF6EF] text-[#168A52]",
  blue: "bg-blue-50 text-blue-700",
  yellow: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  gray: "bg-slate-100 text-slate-600",
};

export default function Badge({
  children,
  variant = "gray",
  icon,
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5",
        "rounded-full px-3 py-1",
        "text-xs font-semibold",
        variants[variant],
      ].join(" ")}
    >
      {icon}
      {children}
    </span>
  );
}