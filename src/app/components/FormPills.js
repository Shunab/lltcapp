"use client";

export default function FormPills({ form }) {
  const formClasses = (result) =>
    result === "W"
      ? "bg-success text-primary-text"
      : "bg-danger text-text";

  return (
    <div className="flex shrink-0 gap-1">
      {form.map((result, idx) => (
        <span
          key={idx}
          className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${formClasses(
            result
          )}`}
        >
          {result}
        </span>
      ))}
    </div>
  );
}
