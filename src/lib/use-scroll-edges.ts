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

/* Horizontal overflow only. scrollIntoView also moves the page, and at
   CSS zoom that yanked the catalog hundreds of pixels. */
export function scrollIntoRail(pane: HTMLElement, el: HTMLElement) {
  const zoom = Number.parseFloat(getComputedStyle(document.documentElement).zoom);
  const scale = Number.isFinite(zoom) && zoom > 0 ? zoom : 1;
  const box = pane.getBoundingClientRect();
  const row = el.getBoundingClientRect();
  if (row.right > box.right) pane.scrollLeft += (row.right - box.right) / scale;
  else if (row.left < box.left) pane.scrollLeft -= (box.left - row.left) / scale;
}
