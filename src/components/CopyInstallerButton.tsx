"use client";

import { useState } from "react";
import { en } from "@/lib/messages/en";

/* Clipboard only. The shelf does not count copies: a number nobody can
   verify is worse than no number. */
export function CopyInstallerButton({ text, disabled = false }: { text: string; disabled?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  async function onCopy() {
    if (disabled) return;
    try {
      await navigator.clipboard.writeText(text);
      setFailed(false);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setFailed(true);
    }
  }

  return (
    <button
      type="button"
      className="theme-control theme-control-label"
      onClick={onCopy}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {failed ? en.pack.copyFail : copied ? en.pack.copied : en.pack.copy}
    </button>
  );
}
