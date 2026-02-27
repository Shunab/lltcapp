const USERS_KEY = "tennisLadderUsers";
const PRE_CREATED_KEY = "tennisLadderPreCreatedAccounts";

/**
 * Get all registered users (completed onboarding).
 * @returns {Promise<Array<{ userId: string, emailOrPhone: string, profile: object, createdAt: number }>>}
 */
export function getAllUsers() {
  if (typeof window === "undefined") return Promise.resolve([]);
  try {
    const raw = localStorage.getItem(USERS_KEY) || "[]";
    const list = JSON.parse(raw);
    return Promise.resolve(Array.isArray(list) ? list : []);
  } catch {
    return Promise.resolve([]);
  }
}

/**
 * Add or update a user (e.g. after onboarding).
 * @param {{ userId: string, emailOrPhone: string, profile: object }} user
 */
export function addUser(user) {
  if (typeof window === "undefined") return Promise.resolve();
  try {
    const raw = localStorage.getItem(USERS_KEY) || "[]";
    const list = JSON.parse(raw);
    const next = Array.isArray(list) ? [...list] : [];
    const idx = next.findIndex((u) => u.userId === user.userId);
    const record = {
      userId: user.userId,
      emailOrPhone: user.emailOrPhone || "",
      profile: user.profile || {},
      createdAt: idx >= 0 ? next[idx].createdAt : Date.now(),
    };
    if (idx >= 0) next[idx] = record;
    else next.push(record);
    localStorage.setItem(USERS_KEY, JSON.stringify(next));
  } catch (_) {}
  return Promise.resolve();
}

/**
 * Get all pre-created (unclaimed) accounts.
 * @returns {Promise<Array<{ id: string, emailOrPhone: string, profile: object, createdAt: number }>>}
 */
export function getPreCreatedAccounts() {
  if (typeof window === "undefined") return Promise.resolve([]);
  try {
    const raw = localStorage.getItem(PRE_CREATED_KEY) || "[]";
    const list = JSON.parse(raw);
    return Promise.resolve(Array.isArray(list) ? list : []);
  } catch {
    return Promise.resolve([]);
  }
}

/**
 * Add a pre-created account. When a user signs up with same emailOrPhone they claim it.
 * @param {{ emailOrPhone: string, profile: object }} data
 * @returns {Promise<{ id: string }>}
 */
export function addPreCreatedAccount(data) {
  if (typeof window === "undefined") {
    return Promise.resolve({ id: `pre-${Date.now()}` });
  }
  const id = `pre-${Date.now()}`;
  const emailOrPhone = (data?.emailOrPhone || "").trim();
  if (!emailOrPhone) return Promise.reject(new Error("Email or phone is required"));
  try {
    const raw = localStorage.getItem(PRE_CREATED_KEY) || "[]";
    const list = JSON.parse(raw);
    const next = Array.isArray(list) ? [...list] : [];
    next.push({
      id,
      emailOrPhone,
      profile: data?.profile || {},
      createdAt: Date.now(),
    });
    localStorage.setItem(PRE_CREATED_KEY, JSON.stringify(next));
    return Promise.resolve({ id });
  } catch {
    return Promise.resolve({ id });
  }
}

/**
 * Find and remove a pre-created account by emailOrPhone. Returns its profile if found.
 * @param {string} emailOrPhone
 * @returns {Promise<object | null>} Claimed profile or null
 */
export function claimPreCreatedAccount(emailOrPhone) {
  if (typeof window === "undefined") return Promise.resolve(null);
  const key = (emailOrPhone || "").trim().toLowerCase();
  if (!key) return Promise.resolve(null);
  try {
    const raw = localStorage.getItem(PRE_CREATED_KEY) || "[]";
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return Promise.resolve(null);
    const idx = list.findIndex(
      (a) => (a.emailOrPhone || "").trim().toLowerCase() === key
    );
    if (idx === -1) return Promise.resolve(null);
    const [claimed] = list.splice(idx, 1);
    localStorage.setItem(PRE_CREATED_KEY, JSON.stringify(list));
    return Promise.resolve(claimed?.profile ?? null);
  } catch {
    return Promise.resolve(null);
  }
}
