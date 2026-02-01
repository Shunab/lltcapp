"use client";

export default function LadderRow({
  href,
  rank,
  name,
  initials,
  wins,
  losses,
  form,
}) {
  const formClasses = (result) =>
    result === "W"
      ? "bg-success text-primary-text"
      : "bg-danger text-text";

  return (
    <a
      href={href}
      className="block bg-background px-4 py-3 transition-colors hover:bg-card-elevated active:bg-card"
    >
      <div className="flex items-center gap-3">
        {/* Rank */}
        <div className="flex w-6 shrink-0 items-center justify-center">
          <span className="text-sm font-semibold text-muted">
            {rank}
          </span>
        </div>

        {/* Avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold uppercase text-primary-text">
          {initials}
        </div>

        {/* Name + record */}
        <div className="min-w-0 flex-1">
          <p className="min-w-0 break-words text-sm font-semibold text-text">
            {name}
          </p>
          <p className="mt-1 text-xs text-muted">
            {wins}W &mdash; {losses}L
          </p>
        </div>

        {/* Form */}
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
      </div>
    </a>
  );
}

