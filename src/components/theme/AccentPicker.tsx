"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ACCENT_PALETTE, DEFAULT_ACCENT } from "@/lib/theme";
import { applyAccentPreference, readCurrentAccent } from "@/lib/theme-client";

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
  const swatchRefs = useRef<(HTMLButtonElement | null)[]>([]);

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
    const selected = ACCENT_PALETTE.findIndex((color) => color === accent);
    swatchRefs.current[selected >= 0 ? selected : 0]?.focus();
    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open, accent]);

  function pick(value: string) {
    applyAccentPreference(value);
    for (const listener of listeners) listener();
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onSwatchKey(event: React.KeyboardEvent, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const next = (index + delta + ACCENT_PALETTE.length) % ACCENT_PALETTE.length;
    swatchRefs.current[next]?.focus();
  }

  return (
    <div ref={wrapRef} className="theme-accent-picker">
      <button
        ref={triggerRef}
        type="button"
        className="theme-control"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Choose accent color"
        title="Choose accent color"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="theme-accent-dot" aria-hidden="true" />
      </button>
      {open && (
        <div className="theme-accent-popover" role="radiogroup" aria-label="Choose accent color">
          {ACCENT_PALETTE.map((value, index) => (
            <button
              key={value}
              ref={(node) => {
                swatchRefs.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={accent === value}
              aria-label={`Set accent ${value}`}
              title={value}
              className={`theme-accent-swatch${accent === value ? " is-selected" : ""}`}
              style={{ background: value }}
              onClick={() => pick(value)}
              onKeyDown={(event) => onSwatchKey(event, index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
