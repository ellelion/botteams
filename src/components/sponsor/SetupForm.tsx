"use client";

import { useId, useState } from "react";
import { en } from "@/lib/messages/en";
import { LINE_MAX, TITLE_MAX } from "@/lib/rail-review";

type SetupResponse = {
  ok?: boolean;
  live?: boolean;
  needsHuman?: boolean;
  remaining?: number;
  reasons?: string[];
  error?: string;
};

export function SetupForm({ sessionId, remaining: initialRemaining }: { sessionId: string; remaining: number }) {
  const titleCountId = useId();
  const lineCountId = useId();
  const markHintId = useId();
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [line, setLine] = useState("");
  const [remaining, setRemaining] = useState(initialRemaining);
  const [reasons, setReasons] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [live, setLive] = useState(false);
  const [human, setHuman] = useState(false);

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
      setReasons(data.reasons ?? []);
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
          className="spon-input"
          name="title"
          type="text"
          maxLength={TITLE_MAX}
          required
          autoComplete="organization"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          aria-describedby={titleCountId}
        />
      </label>
      <label className={`spon-field${line.length >= LINE_MAX ? " is-full" : ""}`}>
        <span className="spon-field-top">
          <span>{en.sponsor.fieldLine}</span>
          <span id={lineCountId} className="spon-count">{en.sponsor.charsUsed(line.length, LINE_MAX)}</span>
        </span>
        <input
          className="spon-input"
          name="line"
          type="text"
          maxLength={LINE_MAX}
          required
          value={line}
          onChange={(event) => setLine(event.target.value)}
          aria-describedby={lineCountId}
        />
      </label>
      <label className="spon-field">
        <span>{en.sponsor.fieldUrl}</span>
        <input className="spon-input" name="href" type="url" inputMode="url" required placeholder="https://" autoComplete="url" />
      </label>
      <label className="spon-field">
        <span>{en.sponsor.fieldMark}</span>
        <input
          className="spon-file"
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,.png,.jpg,.jpeg,.webp,.svg"
          required
          aria-describedby={markHintId}
        />
        <span id={markHintId} className="spon-field-hint">{en.sponsor.fieldMarkHint}</span>
      </label>
      <button type="submit" className="spon-cta" disabled={busy || remaining <= 0} aria-busy={busy}>
        {busy ? en.sponsor.setupReviewing : en.sponsor.setupSubmit}
      </button>
      <p className="spon-fine">{en.sponsor.setupTries(remaining)}</p>
      {reasons.length > 0 ? (
        <ul className="spon-reasons" role="status">
          {reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      ) : null}
      {error ? <p className="spon-error" role="alert">{error}</p> : null}
    </form>
  );
}
