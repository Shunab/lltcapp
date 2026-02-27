"use client";

import Link from "next/link";

export default function Button({
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  href,
  children,
  ...props
}) {
  const base =
    "inline-flex w-full items-center justify-center rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 disabled:opacity-50 ";

  const variants = {
    primary:
      "bg-primary text-primary-text shadow-md hover:bg-primary-hover hover:shadow-lg active:bg-primary-active",
    secondary:
      "border border-border bg-card text-text hover:bg-card-elevated hover:border-border-subtle active:bg-card",
    ghost: "text-muted hover:text-text hover:bg-card/50",
  };

  const classes = `${base} ${variants[variant] || variants.primary} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}
