"use client";

import { useEffect, useId, useRef, useState } from "react";
import { en } from "@/lib/messages/en";

/* Clipboard only. The shelf does not count copies: a number nobody can
   verify is worse than no number. */
export function CopyInstallerButton({
  text,
  disabled = false,
  disabledReason,
}: {
  text: string;
  disabled?: boolean;
  disabledReason?: string;
}) {
  const reasonId = useId();
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

  const label = disabled
    ? en.customize.blocked
    : failed
      ? en.team.copyFail
      : copied
        ? en.team.copied
        : en.team.copy;

  return (
    <button
      type="button"
      className="theme-control theme-control-label"
      onClick={onCopy}
      disabled={disabled}
      aria-disabled={disabled}
      title={disabled ? disabledReason : undefined}
      aria-describedby={disabled && disabledReason ? reasonId : undefined}
    >
      {label}
      {disabled && disabledReason ? <span id={reasonId} className="sr-only">{disabledReason}</span> : null}
      <span className="sr-only" role="status" aria-live="polite">
        {copied || failed ? label : ""}
      </span>
    </button>
  );
}
