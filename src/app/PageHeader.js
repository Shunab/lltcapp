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
      <div className="sticky top-0 z-10 border-b border-border-subtle bg-card/95 px-4 pb-3 pt-4 backdrop-blur-md">
        <h1 className="mb-3 text-xl font-bold tracking-tight text-text">
          {title ?? "Ladder"}
        </h1>

        <div className="flex rounded-xl bg-card p-1 text-xs font-medium text-muted">
          <button
            type="button"
            onClick={() => onChangeMode?.("singles")}
            className={`flex-1 rounded-lg px-3 py-2 transition-all duration-200 ${
              mode === "singles"
                ? "bg-primary text-primary-text"
                : "hover:text-text"
            }`}
          >
            Singles
          </button>
          <button
            type="button"
            onClick={() => onChangeMode?.("doubles")}
            className={`flex-1 rounded-lg px-3 py-2 transition-all duration-200 ${
              mode === "doubles"
                ? "bg-primary text-primary-text"
                : "hover:text-text"
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
      <div className="sticky top-0 z-10 border-b border-border-subtle bg-card/95 px-4 pb-3 pt-4 backdrop-blur-md">
        <h1 className="mb-3 text-xl font-bold tracking-tight text-text">
          {title ?? "Matches"}
        </h1>

        <div className="flex rounded-xl bg-card p-1 text-xs font-medium text-muted">
          <button
            type="button"
            onClick={() => onChangeMode?.("mine")}
            className={`flex-1 rounded-lg px-3 py-2 transition-all duration-200 ${
              mode === "mine"
                ? "bg-primary text-primary-text"
                : "hover:text-text"
            }`}
          >
            My Matches
          </button>
          <button
            type="button"
            onClick={() => onChangeMode?.("all")}
            className={`flex-1 rounded-lg px-3 py-2 transition-all duration-200 ${
              mode === "all"
                ? "bg-primary text-primary-text"
                : "hover:text-text"
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
      <div className="sticky top-0 z-10 border-b border-border-subtle bg-card/95 px-4 py-3 backdrop-blur-md">
        <div className="flex min-w-0 items-center gap-2">
          {showBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex shrink-0 items-center justify-center rounded-xl p-2 text-muted transition-all duration-200 hover:bg-card-elevated hover:text-text active:opacity-80"
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

