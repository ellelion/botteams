"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useCopyFeedback } from "@/lib/use-copy-feedback";
import { useDialogChrome } from "@/lib/use-dialog-chrome";
import { en } from "@/lib/messages/en";
import { site } from "@/lib/site";

const HANDLE = site.xHandle;

function CloseIcon() {
  return (
    <svg viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      <path d="M4.5 4.5l9 9M13.5 4.5l-9 9" />
    </svg>
  );
}

export function XTagDialog() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const bodyId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const copy = useCopyFeedback();

  useEffect(() => {
    /* Portals need document.body, which does not exist during server render. */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  useDialogChrome({
    open,
    rootRef,
    onClose: close,
    restoreFromRef: triggerRef,
    getInitialFocus: (root) => root.querySelector<HTMLButtonElement>("[data-x-tag-close]"),
  });

  const dialog = open && mounted
    ? createPortal(
        <div ref={rootRef} className="x-tag-wrap" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={bodyId}>
          <button type="button" className="x-tag-scrim" tabIndex={-1} aria-label={en.xTag.close} onClick={close} />
          <div className="x-tag-dialog">
            <div className="x-tag-head">
              <h2 id={titleId}>{en.xTag.title}</h2>
              <button type="button" className="x-tag-close" data-x-tag-close aria-label={en.xTag.close} onClick={close}>
                <CloseIcon />
              </button>
            </div>
            <ol id={bodyId} className="x-tag-steps">
              <li>{en.xTag.stepOne}</li>
              <li>{en.xTag.stepTwo(HANDLE)}</li>
              <li>{en.xTag.stepThree}</li>
            </ol>

            <div className="x-tag-thread" aria-hidden="true">
              <div className="x-tag-post">
                <span className="x-tag-avatar">R</span>
                <div>
                  <strong>@riley</strong>
                  <p>Built a support Bot that reads Zendesk, groups repeat issues, and drafts a weekly FAQ update.</p>
                </div>
              </div>
              <div className="x-tag-post x-tag-reply">
                <span className="x-tag-avatar x-tag-avatar-you">Y</span>
                <div>
                  <strong>@you</strong>
                  <p><span>{HANDLE}</span> add this</p>
                </div>
              </div>
            </div>

            <p className="x-tag-review">{en.xTag.review}</p>
            <button
              type="button"
              className={`x-tag-copy${copy.failed ? " is-copy-fail" : ""}`}
              onClick={() => copy.copyText(HANDLE)}
            >
              {copy.copied ? en.xTag.copied : copy.failed ? en.xTag.copyFailed : en.xTag.copy(HANDLE)}
            </button>
            <span className="sr-only" aria-live="polite">
              {copy.copied ? en.xTag.copied : copy.failed ? en.xTag.copyFailed : ""}
            </span>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <button ref={triggerRef} type="button" className="home-contribute-action accent-hover" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        {en.xTag.trigger(HANDLE)}
      </button>
      {dialog}
    </>
  );
}
