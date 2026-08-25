import Link from "next/link";
import { en } from "@/lib/messages/en";

/*
 * Verified is one claim: the group chat holds two to six Bots and the
 * roster is intact. The date on the home hero is a different claim
 * (when we last read xAI's published limits), so this chip goes to the
 * spec section that defines the badge, not the limits list.
 */
export function VerifiedChip({ className = "", on = true }: { className?: string; on?: boolean }) {
  return (
    <Link
      href="/docs#verified"
      className={`chip ${on ? "chip-verified" : "chip-unverified"} ${className}`.trim()}
    >
      {on ? en.verified : en.notVerified}
      <span className="sr-only">. {en.verifiedHint}</span>
    </Link>
  );
}
