"use client";

export default function Input({
  id,
  label,
  error,
  type = "text",
  className = "",
  ...props
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-muted"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`
          w-full rounded-lg border bg-card px-4 py-3 text-sm text-text
          placeholder:text-muted
          focus:border-primary focus:outline-none
          disabled:opacity-50
          ${error ? "border-danger" : "border-border"}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}
    </div>
  );
}
