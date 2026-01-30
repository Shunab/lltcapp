import { playersData } from "../../data/players";

/**
 * Get leaderboard for a mode (singles or doubles).
 * Uses src/data/players; singles = id < 100, doubles = id >= 100.
 * @param {"singles" | "doubles"} mode
 * @returns {Promise<Array<{ id: number, rank: number, name: string, initials: string, wins: number, losses: number, status: string, form: string[] }>>}
 */
export function getLeaderboard(mode) {
  const isSingles = mode === "singles";
  const list = Object.values(playersData)
    .filter((p) => (isSingles ? p.id < 100 : p.id >= 100))
    .sort((a, b) => a.rank - b.rank)
    .map((p) => ({
      id: p.id,
      rank: p.rank,
      name: p.name,
      initials: p.initials,
      wins: p.wins,
      losses: p.losses,
      status: p.status,
      form: p.form,
    }));
  return Promise.resolve(list);
}

/**
 * Get a single player by id.
 * @param {number} id
 * @returns {Promise<import("../../data/players").playersData[key] | null>}
 */
export function getPlayer(id) {
  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  const player = playersData[numId] ? { ...playersData[numId] } : null;
  return Promise.resolve(player);
}

/**
 * Get list of players for a mode (for dropdowns etc).
 * @param {"singles" | "doubles"} mode
 * @returns {Promise<Array<{ id: number, name: string, initials: string }>>}
 */
export function getPlayers(mode) {
  const isSingles = mode === "singles";
  const list = Object.values(playersData)
    .filter((p) => (isSingles ? p.id < 100 : p.id >= 100))
    .map((p) => ({ id: p.id, name: p.name, initials: p.initials }));
  return Promise.resolve(list);
}
