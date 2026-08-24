"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusables(root: HTMLElement) {
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => {
    if (el.hasAttribute("disabled") || el.getAttribute("aria-hidden") === "true") return false;
    if (
      el.classList.contains("rp-scrim") ||
      el.classList.contains("site-menu-scrim") ||
      el.classList.contains("talk-overlay-scrim") ||
      el.classList.contains("cz-overwrite-scrim")
    ) {
      return false;
    }
    return true;
  });
}

/*
 * Inert every ancestor sibling of `keep` so an in-page dialog (site menu,
 * accent picker) isolates the rest of the document the same way a
 * portaled sheet does. Walking to body also covers Watch / Customize /
 * overwrite, which sit as a body child.
 */
function isolate(keep: HTMLElement) {
  const nodes: { el: HTMLElement; prev: boolean }[] = [];
  let node: HTMLElement | null = keep;
  while (node && node.parentElement) {
    for (const sibling of node.parentElement.children) {
      if (sibling === node || !(sibling instanceof HTMLElement)) continue;
      nodes.push({ el: sibling, prev: sibling.inert });
      sibling.inert = true;
    }
    if (node.parentElement === document.body) break;
    node = node.parentElement;
  }
  return () => {
    for (const { el, prev } of nodes) el.inert = prev;
  };
}

/*
 * Dialog chrome for sheets, Watch, overwrite, and the mobile menu: lock
 * page scroll, move focus in, trap Tab, close on Escape, restore focus
 * on the way out. `paused` keeps the sheet mounted under overwrite
 * without stealing keys, inert, or focus. Restore is keyed only to
 * `open` so pausing does not jump back to the Customize trigger.
 */
export function useDialogChrome({
  open,
  paused = false,
  rootRef,
  onClose,
  getInitialFocus,
}: {
  open: boolean;
  paused?: boolean;
  rootRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  getInitialFocus?: (root: HTMLElement) => HTMLElement | null | undefined;
}) {
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    return () => {
      restoreRef.current?.focus();
      restoreRef.current = null;
    };
  }, [open]);

  useEffect(() => {
    if (!open || paused) return;
    const panel = rootRef.current;
    if (!panel) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const release = isolate(panel);

    const list = focusables(panel);
    const preferred = getInitialFocus?.(panel);
    const start = preferred ?? list.find((el) => el !== restoreRef.current) ?? list[0];
    /* Opening: move focus in. Resuming after overwrite: the field that
       triggered the alert is already inside, so leave it alone. A trigger
       that lives inside the root (menu, accent) is list[0], so we still
       step to the first real control. */
    const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const preserve = Boolean(active && panel.contains(active) && active !== list[0] && !preferred);
    if (!preserve) start?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const live = rootRef.current;
      if (!live) return;
      const next = focusables(live);
      if (next.length === 0) return;
      const first = next[0];
      const last = next[next.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      release();
    };
  }, [open, paused, rootRef, onClose, getInitialFocus]);
}
