import {
  ACCENT_STORAGE_KEY,
  DEFAULT_ACCENT,
  THEME_STORAGE_KEY,
  type Theme,
  accentTextFor,
  normalizeStoredAccent,
  normalizeTheme,
  onAccentFor,
  themeColorFor,
} from "@/lib/theme";

export function readCurrentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return normalizeTheme(document.documentElement.dataset.theme) ?? "light";
}

export function readCurrentAccent(): string {
  if (typeof document === "undefined") return DEFAULT_ACCENT;
  return normalizeStoredAccent(getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()) ?? DEFAULT_ACCENT;
}

function updateThemeColor(theme: Theme) {
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute("content", themeColorFor(theme));
}

export function applyAccentPreference(accent: string, persist = true): string {
  const normalized = normalizeStoredAccent(accent) ?? DEFAULT_ACCENT;
  const theme = readCurrentTheme();
  const root = document.documentElement;
  root.style.setProperty("--accent", normalized);
  root.style.setProperty("--accent-text", accentTextFor(normalized, theme));
  root.style.setProperty("--on-accent", onAccentFor(normalized));
  if (persist) {
    try { localStorage.setItem(ACCENT_STORAGE_KEY, normalized); } catch {}
  }
  return normalized;
}

export function applyThemePreference(theme: Theme, persist = true): Theme {
  document.documentElement.dataset.theme = theme;
  applyAccentPreference(readCurrentAccent(), false);
  updateThemeColor(theme);
  if (persist) {
    try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch {}
  }
  return theme;
}
