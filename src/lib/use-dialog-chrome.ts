"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusables(root: HTMLElement) {
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => {
    if (el.hasAttribute("disabled") || el.getAttribute("aria-hidden") === "true") return false;
    if (el.classList.contains("rp-scrim") || el.classList.contains("site-menu-scrim")) return false;
    return true;
  });
}

/*
 * Dialog chrome for sheets and the mobile menu: lock page scroll, move
 * focus in, trap Tab, close on Escape, restore focus on the way out.
 */
export function useDialogChrome({
  open,
  rootRef,
  onClose,
}: {
  open: boolean;
  rootRef: RefObject<HTMLElement | null>;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const root = rootRef.current;
    if (!root) return;

    const restore = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = root;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const start = focusables(dialog).find((el) => el !== restore) ?? focusables(dialog)[0];
    start?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const list = focusables(dialog);
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
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      restore?.focus();
    };
  }, [open, rootRef, onClose]);
}
