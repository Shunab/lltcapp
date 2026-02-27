import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Subtle club colour accent */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/15 to-transparent pointer-events-none" aria-hidden />
      <div className="relative flex max-w-sm flex-col items-center text-center">
        <Image
          src="/logo.png"
          alt="LLTC"
          width={160}
          height={160}
          className="mb-8 h-32 w-auto object-contain"
          priority
        />
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-text">
          LLTC Ladder
        </h1>
        <p className="mb-8 text-sm text-muted">
          Tennis ladder — track rankings and record matches.
        </p>
        <div className="flex w-full flex-col gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-text shadow-md transition hover:bg-primary-hover active:bg-primary-active"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-5 py-3.5 text-sm font-semibold text-text transition hover:bg-card-elevated"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
