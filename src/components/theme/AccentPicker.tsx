"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ACCENT_PALETTE, DEFAULT_ACCENT } from "@/lib/theme";
import { applyAccentPreference, readCurrentAccent } from "@/lib/theme-client";

// The accent lives in the --accent CSS variable, set pre-paint by the
// bootstrap script — an external store, read the same way ThemeToggle
// reads the theme (hydration-safe, no setState-in-effect).
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getServerSnapshot(): string {
  return DEFAULT_ACCENT;
}

export function AccentPicker() {
  const [open, setOpen] = useState(false);
  const accent = useSyncExternalStore(
    subscribe,
    readCurrentAccent,
    getServerSnapshot,
  );
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const outside = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  function pick(value: string) {
    applyAccentPreference(value);
    for (const listener of listeners) listener();
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div ref={wrapRef} className="theme-accent-picker">
      <button
        ref={triggerRef}
        type="button"
        className="theme-control"
        aria-expanded={open}
        aria-label="Choose accent color"
        title="Choose accent color"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="theme-accent-dot" aria-hidden="true" />
      </button>
      {open && (
        <div className="theme-accent-popover" role="group" aria-label="Choose accent color">
          {ACCENT_PALETTE.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={accent === value}
              aria-label={`Set accent ${value}`}
              title={value}
              className={`theme-accent-swatch${accent === value ? " is-selected" : ""}`}
              style={{ background: value }}
              onClick={() => pick(value)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
