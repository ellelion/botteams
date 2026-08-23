"use client";

import { useSearchParams } from "next/navigation";
import { en } from "@/lib/messages/en";

/*
 * Fallback for the old /sponsor?paid=1 return. Checkout now opens
 * /sponsor/setup. This line only catches someone who bookmarked the
 * old URL. It does not say a human will place the ad.
 */
export function PaidNotice() {
  const params = useSearchParams();
  if (params.get("checkout") === "error") {
    return (
      <p className="spon-error" role="alert">{en.sponsor.buyError}</p>
    );
  }
  const paid = params.get("paid") === "1";
  if (!paid) return null;
  return (
    <p className="spon-paid" role="status">{en.sponsor.paid}</p>
  );
}
