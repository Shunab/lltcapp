import { getAllUsers, addUser, claimPreCreatedAccount } from "./userStore";

const SESSION_KEY = "tennisLadderSession";

/**
 * Get full session from localStorage.
 * @returns {Promise<{ sessionUserId: string | null, onboarded: boolean, currentUserProfile: object | null, emailOrPhone: string | null }>}
 */
export function getSession() {
  if (typeof window === "undefined") {
    return Promise.resolve({
      sessionUserId: null,
      onboarded: false,
      currentUserProfile: null,
      emailOrPhone: null,
    });
  }
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return Promise.resolve({
        sessionUserId: null,
        onboarded: false,
        currentUserProfile: null,
        emailOrPhone: null,
      });
    }
    const data = JSON.parse(raw);
    return Promise.resolve({
      sessionUserId: data.sessionUserId ?? null,
      onboarded: Boolean(data.onboarded),
      currentUserProfile: data.currentUserProfile ?? null,
      emailOrPhone: data.emailOrPhone ?? null,
    });
  } catch {
    return Promise.resolve({
      sessionUserId: null,
      onboarded: false,
      currentUserProfile: null,
      emailOrPhone: null,
    });
  }
}

/**
 * Login with email/phone and password. Mock: accepts any non-empty credentials.
 * If a user with this emailOrPhone exists in user store, restores their profile and onboarded state.
 * @param {string} emailOrPhone
 * @param {string} password
 * @returns {Promise<{ sessionUserId: string, onboarded: boolean } | { error: string }>}
 */
export function login(emailOrPhone, password) {
  if (typeof window === "undefined") {
    return Promise.resolve({ error: "Not available" });
  }
  const trimmed = (emailOrPhone || "").trim();
  if (!trimmed) {
    return Promise.resolve({ error: "Email or phone is required" });
  }
  if (!(password || "").trim()) {
    return Promise.resolve({ error: "Password is required" });
  }
  return getAllUsers().then((users) => {
    const key = trimmed.toLowerCase();
    const existing = users.find(
      (u) => (u.emailOrPhone || "").trim().toLowerCase() === key
    );
    const sessionUserId = existing?.userId ?? `user-${Date.now()}`;
    const session = existing
      ? {
          sessionUserId,
          onboarded: true,
          currentUserProfile: existing.profile ?? null,
          emailOrPhone: trimmed,
        }
      : {
          sessionUserId,
          onboarded: false,
          currentUserProfile: null,
          emailOrPhone: trimmed,
        };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return {
      sessionUserId,
      onboarded: Boolean(session.onboarded),
    };
  });
}

/**
 * Signup with form. If emailOrPhone matches a pre-created account (admin), claims it and sets onboarded.
 * @param {{ name: string, emailOrPhone: string, password: string }} form
 * @returns {Promise<{ sessionUserId: string, onboarded: boolean } | { error: string }>}
 */
export function signup(form) {
  if (typeof window === "undefined") {
    return Promise.resolve({ error: "Not available" });
  }
  const name = (form?.name || "").trim();
  const emailOrPhone = (form?.emailOrPhone || "").trim();
  const password = (form?.password || "").trim();
  if (!emailOrPhone) {
    return Promise.resolve({ error: "Email or phone is required" });
  }
  if (!password) {
    return Promise.resolve({ error: "Password is required" });
  }
  return claimPreCreatedAccount(emailOrPhone).then((claimedProfile) => {
    const sessionUserId = `user-${Date.now()}`;
    const session = {
      sessionUserId,
      onboarded: Boolean(claimedProfile),
      currentUserProfile: claimedProfile || null,
      emailOrPhone,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    if (claimedProfile) {
      return addUser({
        userId: sessionUserId,
        emailOrPhone,
        profile: claimedProfile,
      }).then(() => ({
        sessionUserId,
        onboarded: true,
      }));
    }
    return Promise.resolve({
      sessionUserId,
      onboarded: false,
    });
  });
}

/**
 * Clear session and redirect to /login (caller should navigate).
 */
export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Get current user from session (sessionUserId + currentUserProfile).
 * @returns {Promise<{ sessionUserId: string, onboarded: boolean, currentUserProfile: object | null } | null>}
 */
export function getCurrentUser() {
  return getSession().then((s) => {
    if (!s.sessionUserId) return null;
    return {
      sessionUserId: s.sessionUserId,
      onboarded: s.onboarded,
      currentUserProfile: s.currentUserProfile,
    };
  });
}

/**
 * Save onboarding profile and set onboarded=true. Also registers user in user store.
 * @param {object} profileData
 * @returns {Promise<void>}
 */
export function setOnboarded(profileData) {
  if (typeof window === "undefined") return Promise.resolve();
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    const session = raw ? JSON.parse(raw) : {};
    session.onboarded = true;
    session.currentUserProfile = profileData || null;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    const emailOrPhone = session.emailOrPhone || "";
    if (session.sessionUserId && emailOrPhone) {
      return addUser({
        userId: session.sessionUserId,
        emailOrPhone,
        profile: profileData || {},
      });
    }
    return Promise.resolve();
  } catch {
    return Promise.resolve();
  }
}

/**
 * Update currentUserProfile (merge partial into existing). Keeps onboarded and sessionUserId.
 * @param {object} partial
 * @returns {Promise<void>}
 */
export function updateProfile(partial) {
  if (typeof window === "undefined") return Promise.resolve();
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    const session = raw ? JSON.parse(raw) : {};
    const current = session.currentUserProfile || {};
    session.currentUserProfile = { ...current, ...partial };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return Promise.resolve();
  } catch {
    return Promise.resolve();
  }
}
