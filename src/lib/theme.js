const THEME_KEY = "tennisLadderTheme";

export const THEME_IDS = ["dark", "light", "dark-warm", "light-cool"];

export const THEME_LABELS = {
  dark: "Dark",
  light: "Light",
  "dark-warm": "Dark (warm)",
  "light-cool": "Light (cool)",
};

const DEFAULT_THEME = "dark";

/**
 * Get stored theme id (from localStorage). Use when hydrating.
 * @returns {string}
 */
export function getStoredTheme() {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const stored = localStorage.getItem(THEME_KEY);
  return THEME_IDS.includes(stored) ? stored : DEFAULT_THEME;
}

/**
 * Set theme: persist and apply to document.
 * @param {string} themeId
 */
export function setTheme(themeId) {
  const id = THEME_IDS.includes(themeId) ? themeId : DEFAULT_THEME;
  if (typeof window !== "undefined") {
    localStorage.setItem(THEME_KEY, id);
    document.documentElement.setAttribute("data-theme", id);
  }
}

/**
 * Apply stored theme to document (call once on mount).
 */
export function applyStoredTheme() {
  const id = getStoredTheme();
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", id);
  }
}
