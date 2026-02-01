"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "../../PageHeader";
import Button from "../../components/Button";
import Card from "../../components/Card";
import { listMatches, confirmMatch } from "../../../lib/api";

export default function MatchDetailPage({ params }) {
  const { id } = use(params);
  const matchId = parseInt(id, 10);
  const router = useRouter();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    listMatches().then((list) => {
      const m = list.find((x) => x.id === matchId);
      setMatch(m ?? null);
      setLoading(false);
    });
  }, [matchId]);

  const handleConfirm = () => {
    setConfirming(true);
    confirmMatch(matchId).then((ok) => {
      setConfirming(false);
      if (ok && match) setMatch({ ...match, status: "confirmed" });
    });
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
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

  if (loading) {
    return (
      <div className="flex h-full flex-col bg-background">
        <PageHeader title="Match" />
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-sm text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="flex h-full flex-col bg-background">
        <PageHeader title="Match Not Found" />
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-sm text-muted">Match not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <PageHeader title="Match Details" />

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-4">
          <Card>
            <p className="text-xs font-medium text-muted">Opponent(s)</p>
            <p className="mt-1 break-words text-sm text-text">
              {match.opponentName}
              {match.opponent2Name ? ` / ${match.opponent2Name}` : ""}
            </p>
          </Card>

          <Card>
            <p className="text-xs font-medium text-muted">Date</p>
            <p className="mt-1 text-sm text-text">{formatDate(match.date)}</p>
          </Card>

          <Card>
            <p className="text-xs font-medium text-muted">Format</p>
            <p className="mt-1 text-sm text-text">{match.mode || "—"}</p>
          </Card>

          <Card>
            <p className="text-xs font-medium text-muted">Score</p>
            <p className="mt-1 text-sm text-text">{formatScore(match.sets)}</p>
          </Card>

          {(match.retired || match.outcomeOverride) && (
            <Card>
              <p className="text-xs font-medium text-muted">Outcome</p>
              <p className="mt-1 text-sm text-text">
                {match.outcomeOverride === "player_a_retired"
                  ? "Player A retired"
                  : match.outcomeOverride === "player_b_retired"
                    ? "Player B retired"
                    : match.outcomeOverride === "draw"
                      ? "Draw"
                      : match.outcomeOverride === "cancelled"
                        ? "Match cancelled"
                        : match.retired
                          ? "Match ended by retirement"
                          : "—"}
              </p>
            </Card>
          )}

          {match.location && (
            <Card>
              <p className="text-xs font-medium text-muted">Location</p>
              <p className="mt-1 break-words text-sm text-text">{match.location}</p>
            </Card>
          )}

          {match.status !== "confirmed" && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleConfirm}
              disabled={confirming}
            >
              {confirming ? "Confirming..." : "Confirm Result"}
            </Button>
          )}

          {match.status === "confirmed" && (
            <div className="rounded-lg border border-success/40 bg-success-muted px-4 py-3">
              <p className="text-sm font-medium text-success">Confirmed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
