"use client";

import { useLayoutEffect } from "react";

/* Text zoom grows the bar. Sticky top, scroll-margin, and 100dvh caps
   all read these tokens as pre-zoom CSS, so write painted size / zoom.
   --menu-max-h is the remaining viewport; --view-* is the full pane. */
export function MastheadHeightSync() {
  useLayoutEffect(() => {
    const el = document.querySelector("header.site-masthead");
    if (!(el instanceof HTMLElement)) return;

    const sync = () => {
      const painted = el.getBoundingClientRect().height;
      const zoom = Number.parseFloat(getComputedStyle(document.documentElement).zoom);
      const scale = Number.isFinite(zoom) && zoom > 0 ? zoom : 1;
      /* getBoundingClientRect is painted. Sticky top and scroll-margin
         are pre-zoom CSS. Writing the painted height made search sit
         200px below the bar at zoom 2 and hid focused catalog names. */
      const height = Math.round(painted / scale);
      const viewW = Math.round(window.innerWidth / scale);
      const viewH = Math.round(window.innerHeight / scale);
      const menuMax = Math.max(0, viewH - height);
      if (height > 0) {
        document.documentElement.style.setProperty("--masthead-h", `${height}px`);
        document.documentElement.style.setProperty("--view-w", `${viewW}px`);
        document.documentElement.style.setProperty("--view-h", `${viewH}px`);
        document.documentElement.style.setProperty("--menu-max-h", `${menuMax}px`);
      }
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    window.addEventListener("resize", sync);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
      document.documentElement.style.removeProperty("--masthead-h");
      document.documentElement.style.removeProperty("--view-w");
      document.documentElement.style.removeProperty("--view-h");
      document.documentElement.style.removeProperty("--menu-max-h");
    };
  }, []);

  return null;
}
