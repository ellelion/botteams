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
 * without stealing keys, inert, or focus.
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
  const skipRestoreRef = useRef(false);
  skipRestoreRef.current = Boolean(paused);

  useEffect(() => {
    if (!open || paused) return;
    const root = rootRef.current;
    if (!root) return;

    const restore = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const release = isolate(root);

    const list = focusables(root);
    const preferred = getInitialFocus?.(root);
    const start = preferred ?? list.find((el) => el !== restore) ?? list[0];
    /* Opening: move focus in. Resuming after overwrite: the field that
       triggered the alert is already inside, so leave it alone. A trigger
       that lives inside the root (menu, accent) is list[0], so we still
       step to the first real control. */
    const preserve = Boolean(restore && root.contains(restore) && restore !== list[0] && !preferred);
    if (!preserve) start?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const next = focusables(root);
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
      if (!skipRestoreRef.current) restore?.focus();
    };
  }, [open, paused, rootRef, onClose, getInitialFocus]);
}
