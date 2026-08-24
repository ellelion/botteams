"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

export function useScrollEdges<T extends HTMLElement>(watch?: unknown) {
  const ref = useRef<T>(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const start = scrollLeft > 2;
    const end = scrollLeft + clientWidth < scrollWidth - 2;
    setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
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

  return { ref, edges, measure };
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

/* Chrome still scrolls the page under CSS zoom even with preventScroll,
   and a category change re-renders the catalog ~90ms later which scrolls
   again. Hold vertical window / overflow panes long enough to cover that
   second pass. Horizontal pane offsets stay put so a follow-up
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
  window.addEventListener("scroll", restore);
  const start = performance.now();
  const stop = () => window.removeEventListener("scroll", restore);
  const tick = () => {
    restore();
    if (performance.now() - start < 220) requestAnimationFrame(tick);
    else stop();
  };
  requestAnimationFrame(tick);
  window.setTimeout(stop, 240);
}
