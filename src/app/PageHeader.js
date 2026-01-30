"use client";

export default function PageHeader({
  page,
  mode,
  onChangeMode,
  title,
  showBack,
  onBack,
  titleRight,
}) {
  if (page === "ladder") {
    return (
      <div className="sticky top-0 z-10 border-b border-border-subtle bg-card/95 px-4 pb-3 pt-4 backdrop-blur">
        <h1 className="mb-3 text-xl font-semibold text-text">
          {title ?? "Ladder"}
        </h1>

        <div className="flex rounded-full bg-card p-1 text-xs font-medium text-muted">
          <button
            type="button"
            onClick={() => onChangeMode?.("singles")}
            className={`flex-1 rounded-full px-3 py-1.5 transition-colors ${
              mode === "singles"
                ? "bg-text text-background"
                : "text-muted"
            }`}
          >
            Singles
          </button>
          <button
            type="button"
            onClick={() => onChangeMode?.("doubles")}
            className={`flex-1 rounded-full px-3 py-1.5 transition-colors ${
              mode === "doubles"
                ? "bg-text text-background"
                : "text-muted"
            }`}
          >
            Doubles
          </button>
        </div>
      </div>
    );
  }

  if (page === "matches") {
    return (
      <div className="sticky top-0 z-10 border-b border-border-subtle bg-card/95 px-4 pb-3 pt-4 backdrop-blur">
        <h1 className="mb-3 text-xl font-semibold text-text">
          {title ?? "Matches"}
        </h1>

        <div className="flex rounded-full bg-card p-1 text-xs font-medium text-muted">
          <button
            type="button"
            onClick={() => onChangeMode?.("mine")}
            className={`flex-1 rounded-full px-3 py-1.5 transition-colors ${
              mode === "mine"
                ? "bg-text text-background"
                : "text-muted"
            }`}
          >
            My Matches
          </button>
          <button
            type="button"
            onClick={() => onChangeMode?.("all")}
            className={`flex-1 rounded-full px-3 py-1.5 transition-colors ${
              mode === "all"
                ? "bg-text text-background"
                : "text-muted"
            }`}
          >
            All Matches
          </button>
        </div>
      </div>
    );
  }

  if (title) {
    return (
      <div className="sticky top-0 z-10 border-b border-border-subtle bg-card/95 px-4 py-3 backdrop-blur">
        <div className="flex min-w-0 items-center gap-2">
          {showBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex shrink-0 items-center justify-center rounded-full p-1.5 text-muted transition-colors hover:bg-card hover:text-text active:opacity-80"
              aria-label="Back"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          <h1 className="min-w-0 flex-1 truncate text-base font-semibold text-text">
            {title}
          </h1>
          {typeof titleRight === "function" ? titleRight() : titleRight}
        </div>
      </div>
    );
  }

  return null;
}

