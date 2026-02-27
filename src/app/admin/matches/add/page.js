"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import Card from "../../../components/Card";
import SectionTitle from "../../../components/SectionTitle";
import PlayerPickerModal from "../../../components/PlayerPickerModal";
import Select from "../../../components/Select";
import { createMatch } from "../../../../lib/api";
import { getAllUsers } from "../../../../lib/userStore";
import { courts } from "../../../../data/courts";

const OUTCOME_OPTIONS = [
  { value: "", label: "As calculated" },
  { value: "player_a_retired", label: "Player A retired" },
  { value: "player_b_retired", label: "Player B retired" },
  { value: "draw", label: "Draw" },
  { value: "cancelled", label: "Match cancelled" },
];

const MAX_SETS = 5;
const INITIAL_SETS = 2;

function parseNum(v) {
  const n = parseInt(String(v).trim(), 10);
  return Number.isNaN(n) ? null : n;
}

function isTiebreakOnlySet(p1, p2) {
  if (p1 == null || p2 == null) return false;
  return (p1 >= 7 || p2 >= 7) && p1 !== 6 && p2 !== 6;
}

function isRegularSetValid(p1, p2) {
  if (p1 == null || p2 == null) return false;
  const a = Math.max(p1, p2);
  const b = Math.min(p1, p2);
  if (a < 6) return false;
  if (a === 6) return b >= 0 && b <= 4;
  if (a === 7) {
    if (b === 6) return true;
    if (b === 5) return true;
    return false;
  }
  return false;
}

function validateTiebreak(tb1, tb2) {
  if (tb1 == null && tb2 == null) return null;
  if (tb1 == null || tb2 == null) return "Enter both tiebreak scores";
  if (tb1 < 0 || tb2 < 0 || tb1 > 25 || tb2 > 25) return "Tiebreak 0–25";
  const maxT = Math.max(tb1, tb2);
  const minT = Math.min(tb1, tb2);
  if (maxT < 7) return "Tiebreak: first to 7 (or 2 clear after 6–6)";
  if (maxT >= 7 && maxT - minT < 2) return "Tiebreak must be won by 2";
  return null;
}

function validateSet(set, index) {
  const p1 = parseNum(set.player1);
  const p2 = parseNum(set.player2);
  if (p1 == null && p2 == null) return null;
  if (p1 == null || p2 == null) return "Enter both scores";
  if (p1 < 0 || p2 < 0) return "Scores must be 0 or more";
  if (isTiebreakOnlySet(p1, p2)) return null;
  if (!isRegularSetValid(p1, p2)) {
    if (p1 === 6 && p2 === 6) return null;
    return "Invalid set score (e.g. 6-4, 7-5, 7-6)";
  }
  if (p1 === 6 && p2 === 6) {
    const tb1 = parseNum(set.tiebreak1);
    const tb2 = parseNum(set.tiebreak2);
    const tbErr = validateTiebreak(tb1, tb2);
    if (tbErr) return tbErr;
  }
  return null;
}

function showTiebreakForSet(set) {
  const p1 = parseNum(set.player1);
  const p2 = parseNum(set.player2);
  return p1 === 6 && p2 === 6;
}

function userDisplayName(u) {
  const p = u.profile || {};
  const first = (p.firstName || "").trim();
  const last = (p.lastName || "").trim();
  if (first || last) return [first, last].filter(Boolean).join(" ");
  return u.emailOrPhone || u.userId;
}

export default function AdminAddMatchPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [recordedByUserId, setRecordedByUserId] = useState("");
  const [mode, setMode] = useState("singles");
  const [partnerId, setPartnerId] = useState(null);
  const [partnerName, setPartnerName] = useState("");
  const [opponentId, setOpponentId] = useState(null);
  const [opponentName, setOpponentName] = useState("");
  const [opponent2Id, setOpponent2Id] = useState(null);
  const [opponent2Name, setOpponent2Name] = useState("");
  const [sets, setSets] = useState(
    Array.from({ length: INITIAL_SETS }, () => ({
      player1: "",
      player2: "",
      tiebreak1: "",
      tiebreak2: "",
    }))
  );
  const [matchDate, setMatchDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [location, setLocation] = useState("");
  const [outcomeOverride, setOutcomeOverride] = useState("");
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerRole, setPickerRole] = useState(null);

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

  const openPicker = (role) => {
    setPickerRole(role);
    setPickerOpen(true);
  };

  const handlePickPlayer = (player) => {
    if (pickerRole === "partner") {
      setPartnerId(player.id);
      setPartnerName(player.name);
    } else if (pickerRole === "opponent") {
      setOpponentId(player.id);
      setOpponentName(player.name);
    } else if (pickerRole === "opponent2") {
      setOpponent2Id(player.id);
      setOpponent2Name(player.name);
    }
    setPickerOpen(false);
    setPickerRole(null);
  };

  const excludeIdsForPicker = () => {
    const ids = [];
    if (pickerRole === "partner") {
      if (opponentId != null) ids.push(opponentId);
      if (opponent2Id != null) ids.push(opponent2Id);
    } else if (pickerRole === "opponent") {
      if (partnerId != null) ids.push(partnerId);
      if (opponent2Id != null) ids.push(opponent2Id);
    } else if (pickerRole === "opponent2") {
      if (partnerId != null) ids.push(partnerId);
      if (opponentId != null) ids.push(opponentId);
    }
    return ids;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!opponentId) newErrors.opponent = "Select opponent";
    if (mode === "doubles") {
      if (!partnerId) newErrors.partner = "Select your partner";
      if (!opponent2Id) newErrors.opponent2 = "Select second opponent";
    }
    const filledSets = sets.filter(
      (s) => parseNum(s.player1) != null || parseNum(s.player2) != null
    );
    if (filledSets.length === 0) newErrors.sets = "Enter at least one set score";
    sets.forEach((set, i) => {
      const err = validateSet(set, i);
      if (err) newErrors[`set${i}`] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const filteredSets = sets
      .filter((s) => parseNum(s.player1) != null && parseNum(s.player2) != null)
      .map((s) => {
        const p1 = parseNum(s.player1);
        const p2 = parseNum(s.player2);
        const tb1 = parseNum(s.tiebreak1);
        const tb2 = parseNum(s.tiebreak2);
        const tiebreak =
          p1 === 6 && p2 === 6 && tb1 != null && tb2 != null
            ? `${tb1}-${tb2}`
            : undefined;
        return {
          player1: String(p1),
          player2: String(p2),
          ...(tiebreak && { tiebreak: tiebreak }),
        };
      });

    const matchData = {
      date: new Date(matchDate).toISOString(),
      mode,
      opponentId,
      opponentName: opponentName || "",
      opponent2Id: mode === "doubles" ? opponent2Id : null,
      opponent2Name: mode === "doubles" ? opponent2Name || null : null,
      partnerId: mode === "doubles" ? partnerId : null,
      partnerName: mode === "doubles" ? partnerName || null : null,
      sets: filteredSets,
      outcomeOverride: outcomeOverride || null,
      location: location || null,
      recordedByUserId: recordedByUserId || null,
    };

    createMatch(matchData).then(() => {
      setShowSuccess(true);
      setTimeout(() => router.push("/admin/dashboard"), 1500);
    });
  };

  const addSet = () => {
    if (sets.length >= MAX_SETS) return;
    setSets((prev) => [
      ...prev,
      { player1: "", player2: "", tiebreak1: "", tiebreak2: "" },
    ]);
  };

  const courtOptions = [
    { value: "", label: "Select location (optional)" },
    ...courts.map((c) => ({ value: c, label: c })),
  ];

  const recordedByOptions = [
    { value: "", label: "Select who recorded (optional)" },
    ...users.map((u) => ({ value: u.userId, label: userDisplayName(u) })),
  ];

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="sticky top-0 z-10 border-b border-border-subtle bg-card/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <Link
            href="/admin/dashboard"
            className="rounded-full p-1.5 text-muted hover:bg-card hover:text-text"
            aria-label="Back"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-xl font-semibold text-text">Add match</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showSuccess && (
          <div className="mx-4 mt-4 rounded-lg border border-success/40 bg-success-muted px-4 py-3">
            <p className="text-sm font-medium text-success">
              Match recorded. Redirecting...
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 p-4">
          <Select
            id="recordedBy"
            label="Recorded by"
            value={recordedByUserId}
            onChange={(e) => setRecordedByUserId(e.target.value)}
            options={recordedByOptions}
          />

          <div>
            <SectionTitle className="mb-2">Format</SectionTitle>
            <div className="flex rounded-full bg-card p-1 text-xs font-medium text-muted">
              <button
                type="button"
                onClick={() => {
                  setMode("singles");
                  setPartnerId(null);
                  setPartnerName("");
                  setOpponent2Id(null);
                  setOpponent2Name("");
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
                onClick={() => setMode("doubles")}
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

          {mode === "doubles" && (
            <div>
              <SectionTitle className="mb-2">Partner</SectionTitle>
              <button
                type="button"
                onClick={() => openPicker("partner")}
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-left text-text transition-colors hover:bg-card-elevated"
              >
                {partnerName || "Tap to select partner"}
              </button>
              {errors.partner && (
                <p className="mt-1 text-xs text-danger">{errors.partner}</p>
              )}
            </div>
          )}

          <div>
            <SectionTitle className="mb-2">
              {mode === "singles" ? "Opponent" : "Opponent 1"}
            </SectionTitle>
            <button
              type="button"
              onClick={() => openPicker("opponent")}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-left text-text transition-colors hover:bg-card-elevated"
            >
              {opponentName || "Tap to select opponent"}
            </button>
            {errors.opponent && (
              <p className="mt-1 text-xs text-danger">{errors.opponent}</p>
            )}
          </div>

          {mode === "doubles" && (
            <div>
              <SectionTitle className="mb-2">Opponent 2</SectionTitle>
              <button
                type="button"
                onClick={() => openPicker("opponent2")}
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-left text-text transition-colors hover:bg-card-elevated"
              >
                {opponent2Name || "Tap to select opponent 2"}
              </button>
              {errors.opponent2 && (
                <p className="mt-1 text-xs text-danger">{errors.opponent2}</p>
              )}
            </div>
          )}

          <Input
            id="matchDate"
            label="Date of match"
            type="date"
            value={matchDate}
            onChange={(e) => setMatchDate(e.target.value)}
          />

          <div>
            <SectionTitle className="mb-2">Set scores</SectionTitle>
            <p className="mb-2 text-xs text-muted">
              Enter games per set (e.g. 6-4, 7-5). At 6-6 add tiebreak.
              Tiebreak-only: e.g. 12-13.
            </p>
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
                      max="99"
                      placeholder="Player 1"
                      value={set.player1}
                      onChange={(e) => {
                        const v = e.target.value;
                        const next = [...sets];
                        next[index] = { ...next[index], player1: v };
                        setSets(next);
                      }}
                      className={`w-full rounded border bg-card px-3 py-2 text-text placeholder:text-muted focus:border-primary focus:outline-none ${
                        errors[`set${index}`]
                          ? "border-danger"
                          : "border-border"
                      }`}
                    />
                    <input
                      type="number"
                      min="0"
                      max="99"
                      placeholder="Player 2"
                      value={set.player2}
                      onChange={(e) => {
                        const v = e.target.value;
                        const next = [...sets];
                        next[index] = { ...next[index], player2: v };
                        setSets(next);
                      }}
                      className={`w-full rounded border bg-card px-3 py-2 text-text placeholder:text-muted focus:border-primary focus:outline-none ${
                        errors[`set${index}`]
                          ? "border-danger"
                          : "border-border"
                      }`}
                    />
                  </div>
                  {showTiebreakForSet(set) && (
                    <div className="mt-2">
                      <label className="mb-1 block text-xs text-muted">
                        Tiebreak (first to 7, win by 2)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          min="0"
                          max="25"
                          placeholder="P1"
                          value={set.tiebreak1}
                          onChange={(e) => {
                            const next = [...sets];
                            next[index] = {
                              ...next[index],
                              tiebreak1: e.target.value,
                            };
                            setSets(next);
                          }}
                          className="w-full rounded border border-border bg-card px-3 py-2 text-text placeholder:text-muted focus:border-primary focus:outline-none"
                        />
                        <input
                          type="number"
                          min="0"
                          max="25"
                          placeholder="P2"
                          value={set.tiebreak2}
                          onChange={(e) => {
                            const next = [...sets];
                            next[index] = {
                              ...next[index],
                              tiebreak2: e.target.value,
                            };
                            setSets(next);
                          }}
                          className="w-full rounded border border-border bg-card px-3 py-2 text-text placeholder:text-muted focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                  {errors[`set${index}`] && (
                    <p className="mt-1 text-xs text-danger">
                      {errors[`set${index}`]}
                    </p>
                  )}
                </Card>
              ))}
            </div>
            {sets.length < MAX_SETS && (
              <button
                type="button"
                onClick={addSet}
                className="mt-2 text-sm text-primary hover:underline"
              >
                + Add set
              </button>
            )}
          </div>

          <Select
            id="location"
            label="Location (optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            options={courtOptions}
          />

          <div>
            <SectionTitle className="mb-2">Outcome (optional)</SectionTitle>
            <Select
              id="outcome"
              label="Override outcome if different from score"
              value={outcomeOverride}
              onChange={(e) => setOutcomeOverride(e.target.value)}
              options={OUTCOME_OPTIONS}
            />
          </div>

          <Button type="submit">Add match</Button>
        </form>
      </div>

      <PlayerPickerModal
        open={pickerOpen}
        onClose={() => {
          setPickerOpen(false);
          setPickerRole(null);
        }}
        onSelect={handlePickPlayer}
        title={
          pickerRole === "partner"
            ? "Partner"
            : pickerRole === "opponent2"
              ? "Opponent 2"
              : "Opponent"
        }
        mode={mode}
        excludeIds={excludeIdsForPicker()}
      />
    </div>
  );
}
