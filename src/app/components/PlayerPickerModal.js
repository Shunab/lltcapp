"use client";

import { useState, useEffect } from "react";
import { getLeaderboard } from "../../lib/api";

export default function PlayerPickerModal({
  open,
  onClose,
  onSelect,
  title = "Select player",
  mode = "singles",
  excludeIds = [],
}) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Doubles: pick from singles leaderboard (every doubles player has a singles profile)
  const fetchMode = mode === "doubles" ? "singles" : mode;

  useEffect(() => {
    if (open) {
      setSearch("");
      setLoading(true);
      getLeaderboard(fetchMode).then((list) => {
        setPlayers(list);
        setLoading(false);
      });
    }
  }, [open, fetchMode]);

  const filtered = search.trim()
    ? players.filter((p) =>
        p.name.toLowerCase().includes(search.trim().toLowerCase())
      )
    : players;
  const allowed = excludeIds.length
    ? filtered.filter((p) => !excludeIds.includes(p.id))
    : filtered;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="relative flex h-[70vh] min-h-[320px] max-h-[85vh] w-full max-w-md flex-col rounded-t-2xl bg-card border-t border-border sm:rounded-2xl sm:border"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="shrink-0 border-b border-border-subtle bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-text">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-muted hover:bg-card-elevated hover:text-text"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <input
            type="text"
            placeholder="Search players..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-3 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-text placeholder:text-muted focus:border-primary focus:outline-none"
          />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {loading ? (
            <div className="py-8 text-center text-sm text-muted">Loading...</div>
          ) : allowed.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted">
              No players found.
            </div>
          ) : (
            <ul className="divide-y divide-border-subtle">
              {allowed.map((player) => (
                <li key={player.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(player);
                      onClose();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-card-elevated active:bg-card"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold uppercase text-primary-text">
                      {player.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text">
                        {player.name}
                      </p>
                      <p className="text-xs text-muted">
                        #{player.rank} · {player.wins}W {player.losses}L
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
