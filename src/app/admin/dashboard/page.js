"use client";

import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold text-text">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">
        Manage matches and pre-create accounts for new players.
      </p>

      <nav className="mt-6 space-y-3">
        <Link
          href="/admin/matches/add"
          className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-4 text-left text-text transition-colors hover:bg-card-elevated"
        >
          <span className="font-medium">Add match</span>
          <span className="text-muted">→</span>
        </Link>
        <Link
          href="/admin/accounts/create"
          className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-4 text-left text-text transition-colors hover:bg-card-elevated"
        >
          <span className="font-medium">Create account</span>
          <span className="text-muted">→</span>
        </Link>
      </nav>

      <p className="mt-6 text-xs text-muted">
        Create account: add a player by email/phone and optional profile. When
        they sign up with the same email/phone they will continue with that
        profile.
      </p>
    </div>
  );
}
