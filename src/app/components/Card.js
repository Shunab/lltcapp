"use client";

export default function Card({
  children,
  className = "",
  padding = true,
}) {
  return (
    <div
      className={`
        rounded-xl border border-border-subtle bg-card-elevated shadow-sm
        ${padding ? "p-4" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
