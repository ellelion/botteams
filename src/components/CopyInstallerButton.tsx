"use client";

import { useState } from "react";
import { en } from "@/lib/messages/en";

export function CopyInstallerButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  async function onCopy() {
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
    <button type="button" className="theme-control" style={{ width: "auto", padding: "0 12px" }} onClick={onCopy}>
      {failed ? en.pack.copyFail : copied ? en.pack.copied : en.pack.copy}
    </button>
  );
}
