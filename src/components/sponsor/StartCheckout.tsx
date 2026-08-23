"use client";

import { useFormStatus } from "react-dom";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { en } from "@/lib/messages/en";

export function StartCheckout({ featured }: { featured: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={featured ? "spon-cta" : "spon-cta spon-cta-ghost"}
      disabled={pending}
    >
      {en.sponsor.getStarted}
      <ExternalLinkIcon className="spon-cta-out" size={12} />
    </button>
  );
}
