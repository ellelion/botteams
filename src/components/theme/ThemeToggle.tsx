"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_THEME, type Theme } from "@/lib/theme";
import { applyThemePreference, readCurrentTheme } from "@/lib/theme-client";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getServerSnapshot(): Theme {
  return DEFAULT_THEME;
}

function SunMark() {
  return (
    <svg viewBox="0 0 18 18" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      <circle cx="9" cy="9" r="3.1" />
      <path d="M9 2.2v1.6M9 14.2v1.6M2.2 9h1.6M14.2 9h1.6M4.1 4.1l1.1 1.1M12.8 12.8l1.1 1.1M4.1 13.9l1.1-1.1M12.8 5.2l1.1-1.1" />
    </svg>
  );
}

function MoonMark() {
  return (
    <svg viewBox="0 0 18 18" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14.2 10.4A5.4 5.4 0 0 1 7.6 3.8 6.1 6.1 0 1 0 14.2 10.4z" />
    </svg>
  );
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribe,
    readCurrentTheme,
    getServerSnapshot,
  );
  const next = theme === "dark" ? "light" : "dark";
  const label = `Switch to ${next} theme`;

  return (
    <button
      type="button"
      className="theme-control"
      aria-label={label}
      title={label}
      onClick={() => {
        applyThemePreference(next);
        for (const listener of listeners) listener();
      }}
    >
      {theme === "dark" ? <SunMark /> : <MoonMark />}
    </button>
  );
}
