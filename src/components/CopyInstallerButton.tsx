"use client";

import { useEffect, useRef, useState } from "react";
import { en } from "@/lib/messages/en";

/* Clipboard only. The shelf does not count copies: a number nobody can
   verify is worse than no number. */
export function CopyInstallerButton({ text, disabled = false }: { text: string; disabled?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<number>(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function onCopy() {
    if (disabled) return;
    try {
      await navigator.clipboard.writeText(text);
      setFailed(false);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setFailed(true);
    }
  }

  const label = failed ? en.team.copyFail : copied ? en.team.copied : en.team.copy;

  return (
    <button
      type="button"
      className="theme-control theme-control-label"
      onClick={onCopy}
      disabled={disabled}
      aria-disabled={disabled}
      aria-live="polite"
    >
      {label}
    </button>
  );
}
