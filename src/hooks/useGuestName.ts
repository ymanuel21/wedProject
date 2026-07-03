"use client";

import { useSearchParams } from "next/navigation";
import { formatGuestName } from "@/lib/utils";
import type { GuestName } from "@/types";

export function useGuestName(): GuestName {
  const searchParams = useSearchParams();
  const raw = searchParams.get("to");

  return {
    raw,
    display: formatGuestName(raw),
    hasName: !!raw,
  };
}
