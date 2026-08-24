"use client";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import Link from "next/link";
import "./globals.css";
import { en } from "@/lib/messages/en";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" data-theme="dark" className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <main className="idx-empty" style={{ margin: "18vh auto" }}>
          <p className="idx-empty-title">{en.error.title}</p>
          <p className="idx-empty-body">{en.error.body}</p>
          <nav className="notfound-nav" aria-label={en.error.kicker}>
            <button type="button" className="theme-control theme-control-label" onClick={reset}>
              {en.error.retry}
            </button>
            <Link href="/" className="theme-control theme-control-label">{en.error.back}</Link>
          </nav>
        </main>
      </body>
    </html>
  );
}
