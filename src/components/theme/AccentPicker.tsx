"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
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
  const popoverId = useId();
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
    const tab = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const root = wrapRef.current;
      if (!root) return;
      const list = [...root.querySelectorAll<HTMLElement>("button:not([disabled])")];
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", escape);
    document.addEventListener("keydown", tab);
    const selected = ACCENT_PALETTE.findIndex((color) => color === accent);
    swatchRefs.current[selected >= 0 ? selected : 0]?.focus();
    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("keydown", escape);
      document.removeEventListener("keydown", tab);
    };
  }, [open, accent]);

  function pick(value: string) {
    applyAccentPreference(value);
    for (const listener of listeners) listener();
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onSwatchKey(event: React.KeyboardEvent, index: number) {
    if (event.key === "Home") {
      event.preventDefault();
      swatchRefs.current[0]?.focus();
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      swatchRefs.current[ACCENT_PALETTE.length - 1]?.focus();
      return;
    }
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const cols = window.matchMedia("(max-width: 640px), (pointer: coarse)").matches ? 4 : 6;
    const len = ACCENT_PALETTE.length;
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % len;
    else if (event.key === "ArrowLeft") next = (index - 1 + len) % len;
    else if (event.key === "ArrowDown") {
      next = index + cols;
      if (next >= len) next = index % cols;
    } else {
      next = index - cols;
      if (next < 0) {
        const col = index % cols;
        const last = Math.floor((len - 1) / cols) * cols + col;
        next = last >= len ? last - cols : last;
      }
    }
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
        aria-controls={open ? popoverId : undefined}
        aria-label="Choose accent color"
        title="Choose accent color"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="theme-accent-mark" aria-hidden="true">
          <i /><i /><i /><i />
        </span>
      </button>
      {open && (
        <div id={popoverId} className="theme-accent-popover" role="dialog" aria-modal="true" aria-label="Choose accent color">
          <div role="radiogroup" aria-label="Choose accent color">
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
                tabIndex={accent === value ? 0 : -1}
                onClick={() => pick(value)}
                onKeyDown={(event) => onSwatchKey(event, index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
