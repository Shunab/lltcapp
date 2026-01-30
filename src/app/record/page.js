"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageHeader from "../PageHeader";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import { getPlayers, createMatch } from "../../lib/api";
import { getSession } from "../../lib/session";

const MATCH_TYPES = ["Ladder Match", "Challenge", "Friendly", "Tournament"];

export default function RecordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const opponentIdParam = searchParams.get("opponentId");

  const [matchType, setMatchType] = useState("Ladder Match");
  const [mode, setMode] = useState("singles");
  const [opponentId, setOpponentId] = useState(
    opponentIdParam ? parseInt(opponentIdParam, 10) : ""
  );
  const [opponent2Id, setOpponent2Id] = useState("");
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [sets, setSets] = useState([
    { player1: "", player2: "", tiebreak: "" },
    { player1: "", player2: "", tiebreak: "" },
    { player1: "", player2: "", tiebreak: "" },
  ]);
  const [retired, setRetired] = useState(false);
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    getPlayers(mode).then(setAvailablePlayers);
  }, [mode]);

  const validateForm = () => {
    const newErrors = {};

    if (!opponentId) {
      newErrors.opponentId = "Please select an opponent";
    }

    if (mode === "doubles" && !opponent2Id) {
      newErrors.opponent2Id = "Please select second opponent";
    }

    // Validate at least one set has scores
    const hasScores = sets.some(
      (set) => set.player1 && set.player2
    );
    if (!hasScores) {
      newErrors.sets = "Please enter at least one set score";
    }

    // Validate set scores are valid numbers
    sets.forEach((set, index) => {
      if (set.player1 || set.player2) {
        const p1 = parseInt(set.player1, 10);
        const p2 = parseInt(set.player2, 10);
        if (isNaN(p1) || isNaN(p2) || p1 < 0 || p2 < 0) {
          newErrors[`set${index}`] = "Invalid score";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const opponent = availablePlayers.find((p) => p.id === opponentId);
    const opponent2 = opponent2Id
      ? availablePlayers.find((p) => p.id === opponent2Id)
      : null;

    getSession().then((s) => {
      const matchData = {
        date: new Date().toISOString(),
        matchType,
        mode,
        opponentId,
        opponentName: opponent?.name || "",
        opponent2Id: opponent2Id || null,
        opponent2Name: opponent2?.name || null,
        sets: sets.filter((set) => set.player1 && set.player2),
        retired,
        location: location || null,
        recordedByUserId: s?.sessionUserId ?? null,
      };

      createMatch(matchData).then(() => {
        setShowSuccess(true);
        setTimeout(() => router.push("/matches"), 1500);
      });
    });
  };

  const formatSetScore = (set, index) => {
    if (!set.player1 || !set.player2) return "";
    const score = `${set.player1}-${set.player2}`;
    return set.tiebreak ? `${score}(${set.tiebreak})` : score;
  };

  const opponentOptions = [
    { value: "", label: `Select ${mode === "singles" ? "opponent" : "team"}` },
    ...availablePlayers.map((p) => ({ value: String(p.id), label: p.name })),
  ];
  const opponent2Options = [
    { value: "", label: "Select second opponent" },
    ...availablePlayers
      .filter((p) => p.id !== opponentId)
      .map((p) => ({ value: String(p.id), label: p.name })),
  ];

  return (
    <div className="flex h-full flex-col bg-background">
      <PageHeader title="Record Match" />

      <div className="flex-1 overflow-y-auto">
        {showSuccess && (
          <div className="mx-4 mt-4 rounded-lg border border-success/40 bg-success-muted px-4 py-3">
            <p className="text-sm font-medium text-success">
              Match recorded successfully! Redirecting...
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 p-4">
          <Select
            id="matchType"
            label="Match Type"
            value={matchType}
            onChange={(e) => setMatchType(e.target.value)}
            options={MATCH_TYPES}
          />

          <div>
            <SectionTitle className="mb-2">Format</SectionTitle>
            <div className="flex rounded-full bg-card p-1 text-xs font-medium text-muted">
              <button
                type="button"
                onClick={() => {
                  setMode("singles");
                  setOpponentId("");
                  setOpponent2Id("");
                }}
                className={`flex-1 rounded-full px-3 py-2 transition-colors ${
                  mode === "singles"
                    ? "bg-text text-background"
                    : "text-muted"
                }`}
              >
                Singles
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("doubles");
                  setOpponentId("");
                  setOpponent2Id("");
                }}
                className={`flex-1 rounded-full px-3 py-2 transition-colors ${
                  mode === "doubles"
                    ? "bg-text text-background"
                    : "text-muted"
                }`}
              >
                Doubles
              </button>
            </div>
          </div>

          <Select
            id="opponent"
            label={`Opponent ${mode === "singles" ? "" : "Team"}`}
            error={errors.opponentId}
            value={opponentId === "" ? "" : String(opponentId)}
            onChange={(e) =>
              setOpponentId(e.target.value ? parseInt(e.target.value, 10) : "")
            }
            options={opponentOptions}
          />

          {mode === "doubles" && (
            <Select
              id="opponent2"
              label="Second Opponent"
              error={errors.opponent2Id}
              value={opponent2Id === "" ? "" : String(opponent2Id)}
              onChange={(e) =>
                setOpponent2Id(
                  e.target.value ? parseInt(e.target.value, 10) : ""
                )
              }
              options={opponent2Options}
            />
          )}

          <div>
            <SectionTitle className="mb-2">Set Scores</SectionTitle>
            {errors.sets && (
              <p className="mb-2 text-xs text-danger">{errors.sets}</p>
            )}
            <div className="space-y-3">
              {sets.map((set, index) => (
                <Card key={index} padding>
                  <div className="mb-2 text-xs font-medium text-muted">
                    Set {index + 1}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min="0"
                      max="7"
                      placeholder="You"
                      value={set.player1}
                      onChange={(e) => {
                        const newSets = [...sets];
                        newSets[index].player1 = e.target.value;
                        setSets(newSets);
                      }}
                      className={`w-full rounded border bg-card px-3 py-2 text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none ${
                        errors[`set${index}`] ? "border-danger" : "border-border"
                      }`}
                    />
                    <input
                      type="number"
                      min="0"
                      max="7"
                      placeholder="Opponent"
                      value={set.player2}
                      onChange={(e) => {
                        const newSets = [...sets];
                        newSets[index].player2 = e.target.value;
                        setSets(newSets);
                      }}
                      className={`w-full rounded border bg-card px-3 py-2 text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none ${
                        errors[`set${index}`] ? "border-danger" : "border-border"
                      }`}
                    />
                  </div>
                  {(set.player1 || set.player2) && (
                    <div className="mt-2">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        placeholder="Tiebreak (optional)"
                        value={set.tiebreak}
                        onChange={(e) => {
                          const newSets = [...sets];
                          newSets[index].tiebreak = e.target.value;
                          setSets(newSets);
                        }}
                        className="w-full rounded border border-border bg-card px-3 py-2 text-xs text-text placeholder:text-muted focus:border-primary focus:outline-none"
                      />
                    </div>
                  )}
                  {set.player1 && set.player2 && (
                    <div className="mt-2 text-xs text-muted">
                      Score: {formatSetScore(set, index)}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          <Card padding>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="retired"
                checked={retired}
                onChange={(e) => setRetired(e.target.checked)}
                className="h-4 w-4 rounded border-border bg-card text-primary focus:ring-primary"
              />
              <label htmlFor="retired" className="text-sm text-muted">
                Match ended due to retirement
              </label>
            </div>
          </Card>

          <Input
            id="location"
            label="Location (optional)"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Court 1, Main Club"
          />

          <Button type="submit">Record Match</Button>
        </form>
      </div>
    </div>
  );
}
