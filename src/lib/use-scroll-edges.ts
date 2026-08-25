"use client";

import { useCallback, useLayoutEffect, useRef } from "react";

/* Fade marks live on the node via classList. Reading a wrapper
   `{ ref, edges }` during render trips react-hooks/refs, and
   setState from the observer trips set-state-in-effect. */
export function useScrollEdges<T extends HTMLElement>(watch?: unknown) {
  const ref = useRef<T>(null);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    el.classList.toggle("has-start", scrollLeft > 2);
    el.classList.toggle("has-end", scrollLeft + clientWidth < scrollWidth - 2);
  }, []);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure, watch]);

  return ref;
}

/* `zoom` on <html> paints getBoundingClientRect in a different space
   than scrollTop / scrollY. Callers that mix the two must divide. */
export function cssZoom(): number {
  const zoom = Number.parseFloat(getComputedStyle(document.documentElement).zoom);
  return Number.isFinite(zoom) && zoom > 0 ? zoom : 1;
}

/* Horizontal overflow only. scrollIntoView also moves the page, and at
   CSS zoom that yanked the catalog hundreds of pixels. */
export function scrollIntoRail(pane: HTMLElement, el: HTMLElement) {
  const scale = cssZoom();
  const box = pane.getBoundingClientRect();
  const row = el.getBoundingClientRect();
  if (row.right > box.right) pane.scrollLeft += (row.right - box.right) / scale;
  else if (row.left < box.left) pane.scrollLeft -= (box.left - row.left) / scale;
}

/* Chrome still scrolls the page under CSS zoom even with preventScroll.
   Restore vertical window / overflow panes, then the caller can move a
   rail on purpose. Horizontal pane offsets stay put so a follow-up
   scrollIntoRail is not undone. */
export function focusWithoutPageScroll(node: HTMLElement) {
  const x = window.scrollX;
  const y = window.scrollY;
  const panes: { el: HTMLElement; top: number }[] = [];
  for (let n = node.parentElement; n; n = n.parentElement) {
    if (/(auto|scroll)/.test(getComputedStyle(n).overflowY)) {
      panes.push({ el: n, top: n.scrollTop });
    }
  }
  node.focus({ preventScroll: true });
  const restore = () => {
    window.scrollTo(x, y);
    for (const pane of panes) pane.el.scrollTop = pane.top;
  };
  restore();
  requestAnimationFrame(restore);
}
