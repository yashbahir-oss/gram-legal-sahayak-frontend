import type { ReactNode } from "react";

type StatusVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  icon?: ReactNode;
}

const variants: Record<StatusVariant, string> = {
  success: "bg-[#EAF6EF] text-[#168A52]",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  info: "bg-blue-50 text-blue-700",
  neutral: "bg-slate-100 text-slate-600",
};

export default function StatusBadge({
  label,
  variant = "neutral",
  icon,
}: StatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1",
        "text-xs font-semibold",
        variants[variant],
      ].join(" ")}
    >
      {icon}
      {label}
    </span>
  );
}