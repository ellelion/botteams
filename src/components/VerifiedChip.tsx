import Link from "next/link";

export function VerifiedChip({ className = "" }: { className?: string }) {
  return (
    <Link href="/docs" className={`chip chip-verified ${className}`} title="Verified against published Grok Bot limits">
      Verified
    </Link>
  );
}
