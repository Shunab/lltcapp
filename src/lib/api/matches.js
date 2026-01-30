const STORAGE_KEY = "tennisLadderMatches";

/**
 * List all matches from localStorage.
 * @returns {Promise<Array<{ id: number, date: string, matchType: string, mode: string, opponentId: number, opponentName: string, opponent2Id?: number, opponent2Name?: string, sets: Array<{ player1: string, player2: string, tiebreak?: string }>, retired: boolean, location?: string, status?: string }>>}
 */
export function listMatches() {
  if (typeof window === "undefined") return Promise.resolve([]);
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || "[]";
    const list = JSON.parse(raw);
    return Promise.resolve(Array.isArray(list) ? list : []);
  } catch {
    return Promise.resolve([]);
  }
}

/**
 * Append a new match to localStorage.
 * @param {Parameters<typeof listMatches>[0] extends Promise<infer T> ? T[number] : never} match
 * @returns {Promise<{ id: number }>}
 */
export function createMatch(match) {
  if (typeof window === "undefined") {
    return Promise.resolve({ id: Date.now() });
  }
  const id = match.id ?? Date.now();
  const record = { ...match, id };
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || "[]";
    const list = JSON.parse(raw);
    const next = Array.isArray(list) ? [...list, record] : [record];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return Promise.resolve({ id });
  } catch {
    return Promise.resolve({ id });
  }
}

/**
 * Confirm a match (update status to confirmed). Mock: update in localStorage.
 * @param {number} matchId
 * @returns {Promise<boolean>}
 */
export function confirmMatch(matchId) {
  if (typeof window === "undefined") return Promise.resolve(false);
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || "[]";
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return Promise.resolve(false);
    const index = list.findIndex((m) => m.id === matchId);
    if (index === -1) return Promise.resolve(false);
    list[index] = { ...list[index], status: "confirmed" };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return Promise.resolve(true);
  } catch {
    return Promise.resolve(false);
  }
}
