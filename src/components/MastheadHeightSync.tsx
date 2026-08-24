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
      if (height > 0) {
        document.documentElement.style.setProperty("--masthead-h", `${height}px`);
      }
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--masthead-h");
    };
  }, []);

  return null;
}
