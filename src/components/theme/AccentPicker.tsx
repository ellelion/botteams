"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { en } from "@/lib/messages/en";
import { ACCENT_PALETTE, DEFAULT_ACCENT } from "@/lib/theme";
import { applyAccentPreference, readCurrentAccent } from "@/lib/theme-client";
import { useDialogChrome } from "@/lib/use-dialog-chrome";
import { cssZoom } from "@/lib/use-scroll-edges";

function accentName(hex: string): string {
  return (en.theme.accents as Record<string, string>)[hex] ?? hex;
}

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
  const popoverRef = useRef<HTMLDivElement>(null);
  const swatchRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const close = useCallback(() => setOpen(false), []);
  const initialSwatch = useCallback(
    (root: HTMLElement) => root.querySelector<HTMLElement>('[role="radio"][aria-checked="true"]'),
    [],
  );

  useDialogChrome({ open, rootRef: wrapRef, onClose: close, getInitialFocus: initialSwatch });

  /* `right: 0` hangs the 222px phone grid 22px past a 320 frame
     (trigger at x=200). Under 1.4.12 the 1023 masthead wraps and
     the trigger sits at x=16, so the same rule hangs 162px. Place
     in the viewport, zoom-aware, same contract as Select. */
  useLayoutEffect(() => {
    if (!open) return;
    const popNode = popoverRef.current;
    const triggerNode = triggerRef.current;
    if (!popNode || !triggerNode) return;
    const pop = popNode;
    const trigger = triggerNode;

    function place() {
      const box = trigger.getBoundingClientRect();
      const zoom = cssZoom();
      const pad = 8;
      const paintedW = pop.offsetWidth * zoom;
      let left = box.right - paintedW;
      if (left < pad) left = pad;
      if (left + paintedW > window.innerWidth - pad) {
        left = Math.max(pad, window.innerWidth - pad - paintedW);
      }
      const spaceBelow = window.innerHeight - box.bottom - pad;
      const spaceAbove = box.top - pad;
      pop.style.maxHeight = "";
      const cssCap = Number.parseFloat(getComputedStyle(pop).maxHeight);
      const cap = Number.isFinite(cssCap) && cssCap > 0 ? cssCap : Math.min(320, Math.floor((window.innerHeight * 0.5) / zoom));
      const available = Math.max(spaceBelow, spaceAbove) / zoom;
      pop.style.maxHeight = `${Math.max(120, Math.floor(Math.min(available, cap)))}px`;
      const height = pop.offsetHeight * zoom;
      const openUp = spaceBelow < height && spaceAbove > spaceBelow;
      pop.style.position = "fixed";
      pop.style.left = `${left / zoom}px`;
      pop.style.right = "auto";
      pop.style.top = `${(openUp ? box.top - height - pad : box.bottom + pad) / zoom}px`;
    }

    place();
    const ro = new ResizeObserver(place);
    ro.observe(pop);
    window.addEventListener("resize", place);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", place);
      pop.style.position = "";
      pop.style.left = "";
      pop.style.right = "";
      pop.style.top = "";
      pop.style.maxHeight = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const outside = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [open]);

  function pick(value: string) {
    applyAccentPreference(value);
    for (const listener of listeners) listener();
    setOpen(false);
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
    const cols = window.matchMedia("(max-width: 1023px), (pointer: coarse)").matches ? 4 : 6;
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
        aria-label={en.theme.chooseAccent}
        title={en.theme.chooseAccent}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="theme-accent-mark" aria-hidden="true">
          <i /><i /><i /><i />
        </span>
      </button>
      {open && (
        <div ref={popoverRef} id={popoverId} className="theme-accent-popover" role="dialog" aria-modal="true" aria-label={en.theme.chooseAccent}>
          <div role="radiogroup" aria-label={en.theme.chooseAccent}>
            {ACCENT_PALETTE.map((value, index) => (
              <button
                key={value}
                ref={(node) => {
                  swatchRefs.current[index] = node;
                }}
                type="button"
                role="radio"
                aria-checked={accent === value}
                aria-label={en.theme.setAccent(accentName(value))}
                title={accentName(value)}
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
