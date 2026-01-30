"use client";

export default function Select({
  id,
  label,
  error,
  options = [],
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
      <select
        id={id}
        className={`
          w-full rounded-lg border bg-card px-4 py-3 text-sm text-text
          focus:border-primary focus:outline-none
          disabled:opacity-50
          ${error ? "border-danger" : "border-border"}
          ${className}
        `}
        {...props}
      >
        {options.map((opt) =>
          typeof opt === "object" ? (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ) : (
            <option key={opt} value={opt}>
              {opt}
            </option>
          )
        )}
      </select>
      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}
    </div>
  );
}
