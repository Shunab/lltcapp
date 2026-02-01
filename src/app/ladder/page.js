"use client";

import { useState, useEffect } from "react";
import PageHeader from "../PageHeader";
import LadderRow from "./LadderRow";
import { getLeaderboard } from "../../lib/api";

export default function LadderPage() {
  const [mode, setMode] = useState("singles");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getLeaderboard(mode).then((list) => {
      setData(list);
      setLoading(false);
    });
  }, [mode]);

  return (
    <div className="flex h-full flex-col bg-background">
      <PageHeader page="ladder" mode={mode} onChangeMode={setMode} />

      <div className="divide-y divide-border-subtle">
        {loading ? (
          <div className="px-4 py-8 text-center text-sm text-muted">
            Loading...
          </div>
        ) : (
          data.map((player) => (
            <LadderRow
              key={player.id}
              href={`/player/${player.id}`}
              rank={player.rank}
              name={player.name}
              initials={player.initials}
              wins={player.wins}
              losses={player.losses}
              form={player.form}
            />
          ))
        )}
      </div>
    </div>
  );
}
