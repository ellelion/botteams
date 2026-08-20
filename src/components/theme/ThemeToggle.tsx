"use client";

import { useSyncExternalStore } from "react";
import type { Theme } from "@/lib/theme";
import { applyThemePreference, readCurrentTheme } from "@/lib/theme-client";

// The theme lives on <html data-theme>, set pre-paint by the bootstrap
// script — an external store. useSyncExternalStore reads it without the
// setState-in-effect mount dance and stays hydration-safe (the server
// snapshot renders first, then React swaps in the real client value).
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getServerSnapshot(): Theme {
  return "light";
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
      <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
    </button>
  );
}
