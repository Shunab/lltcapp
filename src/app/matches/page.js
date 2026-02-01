"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageHeader from "../PageHeader";
import { listMatches } from "../../lib/api";
import { getSession } from "../../lib/session";

function getInitials(profile) {
  if (!profile) return "?";
  const f = profile.firstName?.trim()?.[0] || "";
  const l = profile.lastName?.trim()?.[0] || "";
  return (f + l).toUpperCase() || "?";
}

function MatchCard({ match, youInitials }) {
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

  const youLabel = match.mode === "doubles" && match.partnerName
    ? `You & ${match.partnerName}`
    : "You";
  const themLabel = match.opponent2Name
    ? `${match.opponentName} & ${match.opponent2Name}`
    : match.opponentName;

  return (
    <Link
      href={`/matches/${match.id}`}
      className="block px-4 py-4 transition-colors hover:bg-card-elevated active:bg-card"
    >
      <div className="grid grid-cols-[80px_1fr_80px] items-center gap-3">
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold uppercase text-primary-text">
            {youInitials}
          </div>
          <span className="w-full truncate text-center text-xs text-muted">
            {youLabel}
          </span>
        </div>
        <div className="min-w-0 overflow-hidden text-center">
          <p className="truncate text-lg font-semibold tabular-nums text-text">
            {formatScore(match.sets)}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted">
            {formatDate(match.date)}
            {match.location ? ` · ${match.location}` : ""}
          </p>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-card-elevated text-sm font-semibold uppercase text-text">
            {match.opponentName?.trim()?.[0]?.toUpperCase() ?? "?"}
          </div>
          <span className="w-full truncate text-center text-xs text-muted">
            {themLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchMode, setMatchMode] = useState("mine");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [youInitials, setYouInitials] = useState("?");

  useEffect(() => {
    getSession().then((s) => {
      setCurrentUserId(s?.sessionUserId ?? null);
      const p = s?.currentUserProfile;
      setYouInitials(getInitials(p));
    });
  }, []);

  useEffect(() => {
    listMatches().then((list) => {
      setMatches(list);
      setLoading(false);
    });
  }, []);

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
              <MatchCard
                key={match.id}
                match={match}
                youInitials={youInitials}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
