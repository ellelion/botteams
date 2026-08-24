"use client";

import { useId, useRef, useState } from "react";
import { en } from "@/lib/messages/en";
import {
  buyerReasonForField,
  fieldsForBuyerReasons,
  LINE_MAX,
  TITLE_MAX,
  type SetupField,
} from "@/lib/rail-review";

type SetupResponse = {
  ok?: boolean;
  live?: boolean;
  needsHuman?: boolean;
  remaining?: number;
  reasons?: string[];
  error?: string;
};

const FIELD_ORDER: SetupField[] = ["title", "line", "href", "image"];

export function SetupForm({ sessionId, remaining: initialRemaining }: { sessionId: string; remaining: number }) {
  const titleCountId = useId();
  const lineCountId = useId();
  const markHintId = useId();
  const titleErrorId = useId();
  const lineErrorId = useId();
  const hrefErrorId = useId();
  const imageErrorId = useId();
  const titleRef = useRef<HTMLInputElement>(null);
  const lineRef = useRef<HTMLInputElement>(null);
  const hrefRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [line, setLine] = useState("");
  const [remaining, setRemaining] = useState(initialRemaining);
  const [reasons, setReasons] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [live, setLive] = useState(false);
  const [human, setHuman] = useState(false);

  const invalid = fieldsForBuyerReasons(reasons);
  const titleError = buyerReasonForField(reasons, "title");
  const lineError = buyerReasonForField(reasons, "line");
  const hrefError = buyerReasonForField(reasons, "href");
  const imageError = buyerReasonForField(reasons, "image");
  const attached = new Set([titleError, lineError, hrefError, imageError].filter(Boolean));
  const formReasons = reasons.filter((text) => !attached.has(text));

  function describedBy(...ids: Array<string | false | undefined>) {
    const joined = ids.filter((id): id is string => Boolean(id)).join(" ");
    return joined || undefined;
  }

  function focusFirstInvalid(nextReasons: string[]) {
    const next = fieldsForBuyerReasons(nextReasons);
    const first = FIELD_ORDER.find((field) => next.has(field));
    const refs = { title: titleRef, line: lineRef, href: hrefRef, image: imageRef };
    if (first) refs[first].current?.focus();
  }

  if (live) {
    return <p className="spon-paid" role="status">{en.sponsor.setupLive}</p>;
  }
  if (human) {
    return (
      <div>
        {reasons.length > 0 ? (
          <ul className="spon-reasons" role="status">
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        ) : null}
        <p className="spon-paid" role="status">{en.sponsor.setupHuman}</p>
      </div>
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (remaining <= 0) {
      setHuman(true);
      return;
    }
    setBusy(true);
    setError("");
    setReasons([]);
    const form = event.currentTarget;
    const body = new FormData(form);
    body.set("session_id", sessionId);
    try {
      const res = await fetch("/api/sponsor/setup", { method: "POST", body });
      const data = (await res.json()) as SetupResponse;
      if (data.live) {
        setLive(true);
        return;
      }
      if (typeof data.remaining === "number") setRemaining(data.remaining);
      if (data.needsHuman) {
        setReasons(data.reasons ?? []);
        setHuman(true);
        return;
      }
      if (!res.ok) {
        setError(data.error ?? en.sponsor.setupError);
        return;
      }
      const next = data.reasons ?? [];
      setReasons(next);
      focusFirstInvalid(next);
    } catch {
      setError(en.sponsor.setupError);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="spon-form" onSubmit={onSubmit} aria-busy={busy}>
      <label className={`spon-field${title.length >= TITLE_MAX ? " is-full" : ""}`}>
        <span className="spon-field-top">
          <span>{en.sponsor.fieldTitle}</span>
          <span id={titleCountId} className="spon-count">{en.sponsor.charsUsed(title.length, TITLE_MAX)}</span>
        </span>
        <input
          ref={titleRef}
          className="spon-input"
          name="title"
          type="text"
          maxLength={TITLE_MAX}
          required
          autoComplete="organization"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          aria-invalid={invalid.has("title") || undefined}
          aria-describedby={describedBy(titleCountId, titleError && titleErrorId)}
        />
        {titleError ? <p id={titleErrorId} className="spon-field-error" role="alert">{titleError}</p> : null}
      </label>
      <label className={`spon-field${line.length >= LINE_MAX ? " is-full" : ""}`}>
        <span className="spon-field-top">
          <span>{en.sponsor.fieldLine}</span>
          <span id={lineCountId} className="spon-count">{en.sponsor.charsUsed(line.length, LINE_MAX)}</span>
        </span>
        <input
          ref={lineRef}
          className="spon-input"
          name="line"
          type="text"
          maxLength={LINE_MAX}
          required
          value={line}
          onChange={(event) => setLine(event.target.value)}
          aria-invalid={invalid.has("line") || undefined}
          aria-describedby={describedBy(lineCountId, lineError && lineErrorId)}
        />
        {lineError ? <p id={lineErrorId} className="spon-field-error" role="alert">{lineError}</p> : null}
      </label>
      <label className="spon-field">
        <span>{en.sponsor.fieldUrl}</span>
        <input
          ref={hrefRef}
          className="spon-input"
          name="href"
          type="url"
          inputMode="url"
          required
          placeholder={en.sponsor.fieldUrlPlaceholder}
          autoComplete="url"
          aria-invalid={invalid.has("href") || undefined}
          aria-describedby={hrefError ? hrefErrorId : undefined}
        />
        {hrefError ? <p id={hrefErrorId} className="spon-field-error" role="alert">{hrefError}</p> : null}
      </label>
      <label className="spon-field">
        <span>{en.sponsor.fieldMark}</span>
        <input
          ref={imageRef}
          className="spon-file"
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,.png,.jpg,.jpeg,.webp,.svg"
          required
          aria-invalid={invalid.has("image") || undefined}
          aria-describedby={describedBy(markHintId, imageError && imageErrorId)}
        />
        <span id={markHintId} className="spon-field-hint">{en.sponsor.fieldMarkHint}</span>
        {imageError ? <p id={imageErrorId} className="spon-field-error" role="alert">{imageError}</p> : null}
      </label>
      <button type="submit" className="spon-cta" disabled={busy || remaining <= 0} aria-busy={busy}>
        {busy ? en.sponsor.setupReviewing : en.sponsor.setupSubmit}
      </button>
      <p className="spon-fine">{en.sponsor.setupTries(remaining)}</p>
      {formReasons.length > 0 ? (
        <ul className="spon-reasons" role="status">
          {formReasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      ) : null}
      {error ? <p className="spon-error" role="alert">{error}</p> : null}
    </form>
  );
}
