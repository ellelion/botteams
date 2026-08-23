"use client";

import { useEffect } from "react";

/* Next.js mounts the N mark in a closed-looking shadow portal at
   bottom-left. Page CSS cannot reach it. Hide the mark so it cannot
   sit on the mobile sponsored rail. */
export function HideNextIndicator() {
  useEffect(() => {
    const hide = () => {
      for (const portal of document.querySelectorAll("nextjs-portal")) {
        const root = portal.shadowRoot;
        if (!root) continue;
        const mark = root.getElementById("devtools-indicator");
        if (mark) mark.style.setProperty("display", "none", "important");
        for (const toast of root.querySelectorAll(".nextjs-toast")) {
          toast.style.setProperty("display", "none", "important");
        }
      }
    };
    hide();
    const observer = new MutationObserver(hide);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return null;
}
