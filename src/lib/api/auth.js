const STORAGE_KEY = "tennisLadderUser";

const mockUser = {
  id: 1,
  name: "Current User",
  email: "user@example.com",
  initials: "CU",
};

/**
 * Mock login. Stores user in localStorage and returns user.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ id: number, name: string, email: string, initials: string } | null>}
 */
export function login(credentials) {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (!credentials?.email) return Promise.resolve(null);
  const user = { ...mockUser, email: credentials.email };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return Promise.resolve(user);
}

/**
 * Mock signup. Same as login for mock; stores user and returns.
 * @param {{ email: string, password: string, name?: string }} data
 * @returns {Promise<{ id: number, name: string, email: string, initials: string } | null>}
 */
export function signup(data) {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (!data?.email) return Promise.resolve(null);
  const user = {
    ...mockUser,
    email: data.email,
    name: data.name || mockUser.name,
    initials: (data.name || mockUser.name).slice(0, 2).toUpperCase(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return Promise.resolve(user);
}

/**
 * Clear current user from localStorage.
 */
export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get current user from localStorage (mock).
 * @returns {Promise<{ id: number, name: string, email: string, initials: string } | null>}
 */
export function currentUser() {
  if (typeof window === "undefined") return Promise.resolve(null);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return Promise.resolve(null);
    const user = JSON.parse(raw);
    return Promise.resolve(user);
  } catch {
    return Promise.resolve(null);
  }
}
