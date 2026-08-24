"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";

/*
 * A listbox we own.
 *
 * The native <select> renders its popup with the OS, so on macOS a light
 * paper page opened a dark blue system menu with none of our type, hairlines,
 * or connector marks in it. This is the same control drawn in our own chrome,
 * with the keyboard contract a native select has:
 *
 *   Enter / Space / Arrow   open, landing on the current value
 *   Arrow, Home, End        move the active option
 *   Type-ahead              jump to the next label with that prefix
 *   Enter                   commit, Esc cancel, blur closes
 *
 * Options carry an optional icon, which is the point: a connector filter
 * that shows the connector's own mark beats one that spells its name.
 */

export type SelectOption = {
  value: string;
  label: string;
  count?: number;
  icon?: ReactNode;
};

export function Select({
  id,
  label,
  caption,
  value,
  options,
  onChange,
  className = "",
  align = "start",
  bare = false,
}: {
  id?: string;
  /* Read to screen readers, and used as the fallback button text. */
  label: string;
  caption?: string;
  value: string;
  options: SelectOption[];
  onChange: (next: string) => void;
  className?: string;
  align?: "start" | "end";
  /* Trigger only. Use next to Install / Fetch when a caption would not fit. */
  bare?: boolean;
}) {
  const auto = useId();
  const listId = `${id ?? auto}-list`;
  const captionId = `${id ?? auto}-caption`;
  const shownCaption = caption ?? label;
  const [open, setOpen] = useState(false);
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const [active, setActive] = useState(selectedIndex);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const typed = useRef({ buffer: "", at: 0 });

  const current = useMemo(() => options[selectedIndex], [options, selectedIndex]);

  /* Close on anything that is not us: outside pointer, or Escape anywhere.
     Capture Escape so a parent dialog (Customize, menu) does not close too. */
  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
      buttonRef.current?.focus();
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  /* Keep the active option in view, including when type-ahead jumps far. */
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  /* Open upward when the list would run off the bottom of the viewport.
     Layout first, then again if icons change the height. */
  useLayoutEffect(() => {
    if (!open) return;
    const listEl = listRef.current;
    const rootEl = rootRef.current;
    if (!listEl || !rootEl) return;
    const list = listEl;
    const root = rootEl;
    function place() {
      const box = root.getBoundingClientRect();
      const spaceBelow = window.innerHeight - box.bottom - 8;
      const spaceAbove = box.top - 8;
      const available = Math.max(spaceBelow, spaceAbove);
      /* Match the stylesheet cap (19rem, or half the viewport on a phone)
         so leftover space above the button cannot become a full-screen menu. */
      list.style.maxHeight = "";
      const cssCap = Number.parseFloat(getComputedStyle(list).maxHeight);
      const cap = Number.isFinite(cssCap) && cssCap > 0 ? cssCap : Math.min(304, Math.floor(window.innerHeight * 0.5));
      list.style.maxHeight = `${Math.max(120, Math.floor(Math.min(available, cap)))}px`;
      const height = list.offsetHeight;
      list.classList.toggle("is-up", spaceBelow < height && spaceAbove > spaceBelow);
    }
    place();
    const ro = new ResizeObserver(place);
    ro.observe(list);
    window.addEventListener("resize", place);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", place);
      listEl.style.maxHeight = "";
      listEl.classList.remove("is-up");
    };
  }, [open]);

  function openAt(index: number) {
    setActive(index);
    setOpen(true);
  }

  function commit(index: number) {
    const next = options[index];
    if (next) onChange(next.value);
    setOpen(false);
    buttonRef.current?.focus();
  }

  function typeAhead(key: string) {
    const now = Date.now();
    const buffer = now - typed.current.at < 700 ? typed.current.buffer + key : key;
    typed.current = { buffer, at: now };
    const from = buffer.length === 1 ? active + 1 : active;
    for (let i = 0; i < options.length; i += 1) {
      const idx = (from + i) % options.length;
      if (options[idx].label.toLowerCase().startsWith(buffer.toLowerCase())) {
        setActive(idx);
        return;
      }
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        openAt(selectedIndex);
      }
      return;
    }
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
        buttonRef.current?.focus();
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        commit(active);
        break;
      case "Tab":
        setOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => Math.min(options.length - 1, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(options.length - 1);
        break;
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) typeAhead(e.key);
    }
  }

  return (
    <div className={`sel${bare ? "" : " has-caption"} ${className}`.trim()} ref={rootRef}>
      {bare ? null : <span className="sel-caption" id={captionId}>{shownCaption}</span>}
      <button
        ref={buttonRef}
        id={id}
        type="button"
        className={`sel-button${open ? " is-open" : ""}`}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        aria-label={label}
        aria-autocomplete="none"
        onClick={() => (open ? setOpen(false) : openAt(selectedIndex))}
        onKeyDown={onKeyDown}
      >
        {current?.icon ? <span className="sel-icon" aria-hidden>{current.icon}</span> : null}
        <span className="sel-value">{current?.label ?? label}</span>
        <svg className="sel-caret" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 9.5l6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <ul
          id={listId}
          ref={listRef}
          className={`sel-list${align === "end" ? " is-end" : ""}`}
          role="listbox"
          aria-label={label}
        >
          {options.map((option, i) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={isSelected}
                data-active={i === active}
                className={`sel-option${isSelected ? " is-selected" : ""}`}
                onPointerEnter={() => setActive(i)}
                onClick={() => commit(i)}
              >
                <span className="sel-tick" aria-hidden>
                  {isSelected ? (
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  ) : null}
                </span>
                {option.icon ? <span className="sel-icon" aria-hidden>{option.icon}</span> : null}
                <span className="sel-label">{option.label}</span>
                {option.count === undefined ? null : <span className="sel-count">{option.count}</span>}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
