"use client";

import { useState } from "react";
import { en } from "@/lib/messages/en";

export function CopyInstallerButton({
  text,
  slug,
  onCopied,
}: {
  text: string;
  slug?: string;
  onCopied?: (count: number, total: number) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setFailed(false);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      if (slug) {
        const res = await fetch("/api/copy", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ slug }),
        });
        if (res.ok) {
          const data = (await res.json()) as { count?: number; total?: number };
          onCopied?.(data.count ?? 0, data.total ?? 0);
        }
      }
    } catch {
      setFailed(true);
    }
  }

  return (
    <button type="button" className="theme-control theme-control-label" onClick={onCopy}>
      {failed ? en.pack.copyFail : copied ? en.pack.copied : en.pack.copy}
    </button>
  );
}
