import Link from "next/link";

/*
 * Verified is one claim: the group chat holds two to six Bots and the
 * roster is intact. Customize can break that live, so the chip has an off
 * state rather than staying lit over a recipe Grok Bot would refuse.
 */
export function VerifiedChip({ className = "", on = true }: { className?: string; on?: boolean }) {
  if (!on) {
    return (
      <span className={`chip chip-unverified ${className}`} title="A group chat holds two to six Bots">
        Not verified
      </span>
    );
  }
  return (
    <Link href="/docs" className={`chip chip-verified ${className}`} title="Verified against published Grok Bot limits">
      Verified
    </Link>
  );
}
