"use client";

import { useId } from "react";
import { en } from "@/lib/messages/en";
import { useCopyFeedback } from "@/lib/use-copy-feedback";

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
  const { copied, failed, copyText } = useCopyFeedback();

  async function onCopy() {
    if (disabled) return;
    await copyText(text);
  }

  /* Keep the action name when copy is blocked. The alert already says
     why. Replacing the label with that sentence duplicates it and, on a
     phone, overflows the sticky row. */
  const label = failed
    ? en.team.copyFail
    : copied
      ? en.team.copied
      : en.team.copy;

  return (
    <>
      <button
        type="button"
        className={`theme-control theme-control-label${failed ? " is-copy-fail" : ""}`}
        onClick={onCopy}
        disabled={disabled}
        aria-disabled={disabled}
        title={disabled ? disabledReason : undefined}
        aria-describedby={disabled && disabledReason ? reasonId : undefined}
      >
        {label}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {copied || failed ? label : ""}
      </span>
      {disabled && disabledReason ? <span id={reasonId} className="sr-only">{disabledReason}</span> : null}
    </>
  );
}
