"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CopyPulse = "idle" | "ok" | "fail";

/* Clipboard success and failure both last two seconds, then the control
   goes back to the action name. A fail that never clears turns the
   primary CTA into an error string the user cannot leave. */
export function useCopyFeedback(resetMs = 2000) {
  const [status, setStatus] = useState<CopyPulse>("idle");
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const pulse = useCallback(
    (next: Exclude<CopyPulse, "idle">) => {
      setStatus(next);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setStatus("idle"), resetMs);
    },
    [resetMs],
  );

  const copyText = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        pulse("ok");
        return true;
      } catch {
        pulse("fail");
        return false;
      }
    },
    [pulse],
  );

  return {
    status,
    copied: status === "ok",
    failed: status === "fail",
    copyText,
  };
}
