import { LoaderCircle } from "lucide-react";

interface LoadingStateProps {
  label?: string;
}

export default function LoadingState({
  label = "माहिती लोड होत आहे...",
}: LoadingStateProps) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white">
      <LoaderCircle
        size={28}
        className="animate-spin text-[#168A52]"
      />

      <p className="mt-3 text-sm font-medium text-slate-500">
        {label}
      </p>
    </div>
  );
}