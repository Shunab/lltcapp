"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "../../PageHeader";
import Button from "../../components/Button";
import StatCard from "../../components/StatCard";
import FormPills from "../../components/FormPills";
import RankChart from "../../components/RankChart";
import { getPlayer } from "../../../lib/api";

export default function PlayerPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const playerId = parseInt(id, 10);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/ladder");
    }
  };

  useEffect(() => {
    getPlayer(playerId).then((p) => {
      setPlayer(p);
      setLoading(false);
    });
  }, [playerId]);

  if (loading) {
    return (
      <div className="flex h-full flex-col bg-background">
        <PageHeader title="Player" />
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-sm text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="flex h-full flex-col bg-background">
        <PageHeader title="Player Not Found" />
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-sm text-muted">Player not found</p>
        </div>
      </div>
    );
  }

  const statusClasses =
    player.status === "Active"
      ? "border-success/40 bg-success-muted text-success"
      : "border-border bg-card-elevated text-muted";

  const winRate = ((player.wins / (player.wins + player.losses)) * 100).toFixed(0);

  return (
    <div className="flex h-full flex-col bg-background">
      <PageHeader
        title={player.name}
        showBack
        onBack={handleBack}
      />

      <div className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <div className="border-b border-border-subtle bg-card-elevated px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold uppercase text-primary-text">
              {player.initials}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="min-w-0 break-words text-xl font-semibold text-text">
                {player.name}
              </h2>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm text-muted">Rank #{player.rank}</span>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusClasses}`}
                >
                  {player.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-3 p-4">
          <StatCard label="Wins" value={player.wins} />
          <StatCard label="Losses" value={player.losses} />
          <StatCard label="Win Rate" value={`${winRate}%`} />
          <StatCard label="Current Rank" value={`#${player.rank}`} />
        </div>

        {/* Last 5 Form */}
        <div className="border-t border-border-subtle px-4 py-4">
          <p className="mb-3 text-xs font-medium text-muted">Last 5 Matches</p>
          <FormPills form={player.form} />
        </div>

        {/* Rank Chart */}
        <div className="border-t border-border-subtle px-4 py-4">
          <RankChart rankHistory={player.rankHistory} />
        </div>

        {/* Action Buttons */}
        <div className="border-t border-border-subtle p-4 pb-8">
          <div className="flex flex-col gap-3">
            <Button href={`/challenge?playerId=${playerId}`}>
              Challenge
            </Button>
            <Button href={`/record?opponentId=${playerId}`} variant="secondary">
              Record Match
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
