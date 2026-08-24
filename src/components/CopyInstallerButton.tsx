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
  const { copied, failed, copyText, pulse } = useCopyFeedback();

  async function onCopy() {
    if (disabled) {
      pulse("fail");
      document.querySelector(".cz-alert-stop")?.scrollIntoView({ block: "nearest" });
      return;
    }
    await copyText(text);
  }

  /* Keep the action name while idle. A blocked click names the block
     for two seconds, then returns. The long reason lives in the alert,
     not on this button, so a phone sticky row does not overflow. */
  const label = failed
    ? (disabled ? en.customize.blocked : en.team.copyFail)
    : copied
      ? en.team.copied
      : en.team.copy;

  return (
    <>
      <button
        type="button"
        className={`theme-control theme-control-label${failed ? " is-copy-fail" : ""}${disabled ? " is-copy-blocked" : ""}`}
        onClick={onCopy}
        aria-disabled={disabled || undefined}
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
