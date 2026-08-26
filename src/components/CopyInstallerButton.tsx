"use client";

import { useId } from "react";
import { en } from "@/lib/messages/en";
import { cssZoom } from "@/lib/use-scroll-edges";
import { useCopyFeedback } from "@/lib/use-copy-feedback";

/* Clipboard only. The shelf does not count copies: a number nobody can
   verify is worse than no number. */
export function CopyInstallerButton({
  text,
  disabled = false,
  disabledReason,
  label: idleLabel = en.team.copy,
  className = "",
}: {
  text: string;
  disabled?: boolean;
  disabledReason?: string;
  label?: string;
  className?: string;
}) {
  const reasonId = useId();
  const { copied, failed, copyText, pulse } = useCopyFeedback();

  async function onCopy() {
    if (disabled) {
      pulse("fail");
      const alert = document.querySelector(".cz-alert-stop");
      const pane = alert instanceof HTMLElement ? alert.closest(".rp-sheet-body") : null;
      if (alert instanceof HTMLElement && pane instanceof HTMLElement) {
        const scale = cssZoom();
        const next =
          (alert.getBoundingClientRect().top - pane.getBoundingClientRect().top) / scale +
          pane.scrollTop;
        pane.scrollTo({ top: Math.max(0, next) });
      } else if (alert instanceof HTMLElement) {
        alert.scrollIntoView({ block: "nearest" });
      }
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
      : idleLabel;

  return (
    <>
      <button
        type="button"
        className={`theme-control theme-control-label${className ? ` ${className}` : ""}${failed ? " is-copy-fail" : ""}${disabled ? " is-copy-blocked" : ""}`}
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
