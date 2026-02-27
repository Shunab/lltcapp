const ADMIN_SESSION_KEY = "tennisLadderAdminSession";

/** Mock admin credentials (no backend). */
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";

/**
 * Get admin session from localStorage.
 * @returns {Promise<{ email: string } | null>}
 */
export function getAdminSession() {
  if (typeof window === "undefined") return Promise.resolve(null);
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return Promise.resolve(null);
    const data = JSON.parse(raw);
    return Promise.resolve(data?.email ? { email: data.email } : null);
  } catch {
    return Promise.resolve(null);
  }
}

/**
 * Admin login. Mock: accepts fixed credentials.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ ok: true } | { error: string }>}
 */
export function adminLogin(email, password) {
  if (typeof window === "undefined") {
    return Promise.resolve({ error: "Not available" });
  }
  const e = (email || "").trim();
  const p = (password || "").trim();
  if (!e) return Promise.resolve({ error: "Email is required" });
  if (!p) return Promise.resolve({ error: "Password is required" });
  if (e !== ADMIN_EMAIL || p !== ADMIN_PASSWORD) {
    return Promise.resolve({ error: "Invalid email or password" });
  }
  localStorage.setItem(
    ADMIN_SESSION_KEY,
    JSON.stringify({ email: e, loggedInAt: Date.now() })
  );
  return Promise.resolve({ ok: true });
}

/**
 * Clear admin session.
 */
export function adminLogout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_SESSION_KEY);
}
