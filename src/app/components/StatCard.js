"use client";

export default function StatCard({ label, value, className = "" }) {
  return (
    <div className={`rounded-lg border border-border-subtle bg-card-elevated p-4 ${className}`}>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-text">{value}</p>
    </div>
  );
}
