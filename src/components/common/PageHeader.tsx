import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  icon,
  children,
}: PageHeaderProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF6EF] px-4 py-2 text-sm font-bold text-[#168A52]">
          {icon}
          {eyebrow}
        </div>
      )}

      <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#12345B] sm:text-5xl">
        {title}
      </h1>

      {description && (
        <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
          {description}
        </p>
      )}

      {children}
    </div>
  );
}