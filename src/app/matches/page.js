"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageHeader from "../PageHeader";
import { listMatches } from "../../lib/api";
import { getSession } from "../../lib/session";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchMode, setMatchMode] = useState("mine");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    getSession().then((s) => {
      setCurrentUserId(s?.sessionUserId ?? null);
    });
  }, []);

  useEffect(() => {
    listMatches().then((list) => {
      setMatches(list);
      setLoading(false);
    });
  }, []);

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatScore = (sets) => {
    if (!sets?.length) return "—";
    return sets
      .map((s) => {
        const score = `${s.player1}-${s.player2}`;
        return s.tiebreak ? `${score}(${s.tiebreak})` : score;
      })
      .join(", ");
  };

  const filteredMatches =
    matchMode === "mine" && currentUserId
      ? matches.filter((m) => m.recordedByUserId === currentUserId)
      : matches;

  return (
    <div className="flex h-full flex-col bg-background">
      <PageHeader
        page="matches"
        title="Matches"
        mode={matchMode}
        onChangeMode={setMatchMode}
      />

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="px-4 py-8 text-center text-sm text-muted">
            Loading...
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted">
            {matchMode === "mine"
              ? "No matches recorded by you yet."
              : "No matches yet. Record a match to get started."}
          </div>
        ) : (
          <div className="divide-y divide-border-subtle">
            {filteredMatches.map((match) => (
              <Link
                key={match.id}
                href={`/matches/${match.id}`}
                className="block px-4 py-3 transition-colors hover:bg-card-elevated active:bg-card"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="min-w-0 break-words text-sm font-medium text-text">
                      vs {match.opponentName}
                      {match.opponent2Name ? ` / ${match.opponent2Name}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {formatDate(match.date)} · {match.matchType}
                      {match.mode ? ` · ${match.mode}` : ""}
                    </p>
                  </div>
                  <div className="shrink-0 text-right text-xs text-muted">
                    {formatScore(match.sets)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
