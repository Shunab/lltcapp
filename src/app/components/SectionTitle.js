"use client";

export default function SectionTitle({
  children,
  className = "",
}) {
  return (
    <p
      className={`text-xs font-medium text-muted ${className}`}
    >
      {children}
    </p>
  );
}
