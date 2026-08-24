"use client";

import { useLayoutEffect } from "react";

/* Text zoom grows the bar. Sticky top, scroll-margin, and 100dvh caps
   all read --masthead-h as pre-zoom CSS, so write painted height / zoom.
   --menu-max-h is the remaining viewport in the same CSS pixels. */
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
      const menuMax = Math.max(0, Math.round(window.innerHeight / scale - height));
      if (height > 0) {
        document.documentElement.style.setProperty("--masthead-h", `${height}px`);
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
      document.documentElement.style.removeProperty("--menu-max-h");
    };
  }, []);

  return null;
}
