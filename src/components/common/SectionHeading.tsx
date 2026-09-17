interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div>
      {eyebrow && (
        <p className="text-sm font-bold uppercase tracking-wider text-[#168A52]">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-2 text-2xl font-bold text-[#12345B] sm:text-3xl">
        {title}
      </h2>

      {description && (
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}