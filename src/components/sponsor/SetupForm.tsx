"use client";

import { useState } from "react";
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
  const [busy, setBusy] = useState(false);
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
    <form className="spon-form" onSubmit={onSubmit}>
      <label className="spon-field">
        <span>{en.sponsor.fieldTitle}</span>
        <input className="spon-input" name="title" type="text" maxLength={TITLE_MAX} required autoComplete="organization" />
      </label>
      <label className="spon-field">
        <span>{en.sponsor.fieldLine}</span>
        <input className="spon-input" name="line" type="text" maxLength={LINE_MAX} required />
      </label>
      <label className="spon-field">
        <span>{en.sponsor.fieldUrl}</span>
        <input className="spon-input" name="href" type="url" inputMode="url" required placeholder="https://" />
      </label>
      <label className="spon-field">
        <span>{en.sponsor.fieldMark}</span>
        <input className="spon-file" name="image" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml,.png,.jpg,.jpeg,.webp,.svg" required />
      </label>
      <button type="submit" className="spon-cta" disabled={busy || remaining <= 0}>
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
