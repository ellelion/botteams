"use client";

import { useLayoutEffect } from "react";

/* Text zoom grows the bar (74px at 200%) while the CSS token stays 62px.
   The menu sheet, scrim, and sticky column all read --masthead-h, so the
   token has to follow the painted header. */
export function MastheadHeightSync() {
  useLayoutEffect(() => {
    const el = document.querySelector("header.site-masthead");
    if (!(el instanceof HTMLElement)) return;

    const sync = () => {
      const height = Math.round(el.getBoundingClientRect().height);
      const zoom = Number.parseFloat(getComputedStyle(document.documentElement).zoom);
      const scale = Number.isFinite(zoom) && zoom > 0 ? zoom : 1;
      /* CSS zoom scales the painted sheet but not 100dvh the same way.
         The phone menu cap has to be in pre-zoom px or Sponsor / GitHub
         stay below the glass at 200%. */
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
