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
    "inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold transition-colors disabled:opacity-50 ";

  const variants = {
    primary:
      "bg-primary text-primary-text hover:bg-primary-hover active:bg-primary-active",
    secondary:
      "border border-border bg-card text-text hover:bg-card-elevated active:bg-card",
    ghost: "text-muted hover:text-text",
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
