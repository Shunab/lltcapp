"use client";

import { useSearchParams } from "next/navigation";
import PageHeader from "../PageHeader";

export default function ChallengePage() {
  const searchParams = useSearchParams();
  const playerId = searchParams.get("playerId");

  return (
    <div className="flex h-full flex-col bg-background">
      <PageHeader title="Challenge" />

      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-sm text-muted">
          {playerId
            ? `Challenge flow for player ${playerId} (coming soon).`
            : "Select a player from the ladder to challenge."}
        </p>
      </div>
    </div>
  );
}
