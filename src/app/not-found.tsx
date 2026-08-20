import Link from "next/link";
import { ledger } from "@/lib/ledger-theme";
import { en } from "@/lib/messages/en";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center" style={{ background: ledger.paper, color: ledger.ink }}>
      <p className="text-[0.62rem] uppercase tracking-[0.3em]" style={{ color: ledger.accentText }}>{en.notFound.kicker}</p>
      <p className="mt-4 text-[clamp(2.4rem,6vw,3.6rem)] font-light leading-none" style={{ fontFamily: ledger.serif }}>404<span style={{ color: ledger.oxblood }}>.</span></p>
      <p className="mt-4 max-w-xs text-[0.82rem] leading-relaxed" style={{ color: ledger.inkMuted }}>{en.notFound.body}</p>
      <Link href="/" className="accent-hover mt-8 text-[0.62rem] uppercase tracking-[0.24em] transition-colors" style={{ color: ledger.inkFaint }}>{en.notFound.back}</Link>
    </div>
  );
}
