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

/* env() is CSS px. getBoundingClientRect is painted (× zoom). */
export function safeAreaCss(): { top: number; right: number; bottom: number; left: number } {
  const el = document.createElement("div");
  el.style.cssText =
    "position:absolute;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)";
  document.body.appendChild(el);
  const cs = getComputedStyle(el);
  const out = {
    top: Number.parseFloat(cs.paddingTop) || 0,
    right: Number.parseFloat(cs.paddingRight) || 0,
    bottom: Number.parseFloat(cs.paddingBottom) || 0,
    left: Number.parseFloat(cs.paddingLeft) || 0,
  };
  el.remove();
  return out;
}

/* Phone ticker / sponsor dock cover the bottom of the viewport.
   A popover that treats innerHeight as the floor opens into that
   strip: the bar stays painted on top while isolate() makes it
   inert, so a tap on a chip changes the accent. */
export function overlayFloor(): number {
  let floor = window.innerHeight;
  for (const sel of [".spon-mq--bottom", ".spon-dock"]) {
    const el = document.querySelector(sel);
    if (!(el instanceof HTMLElement)) continue;
    const cs = getComputedStyle(el);
    const box = el.getBoundingClientRect();
    if (cs.display === "none" || cs.visibility === "hidden" || box.height < 2) continue;
    floor = Math.min(floor, box.top);
  }
  return floor;
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
