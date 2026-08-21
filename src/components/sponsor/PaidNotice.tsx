"use client";

import { useSearchParams } from "next/navigation";
import { en } from "@/lib/messages/en";

/*
 * The line after a payment. It says what actually happened: the money
 * arrived, a person writes the row, and the rail does not change until
 * that person places it. Anything warmer would be a lie about a rail
 * that nobody has been placed on yet.
 *
 * Client side so /sponsor stays static.
 */
export function PaidNotice() {
  const paid = useSearchParams().get("paid") === "1";
  if (!paid) return null;
  return (
    <p className="spon-paid" role="status">{en.sponsor.paid}</p>
  );
}
