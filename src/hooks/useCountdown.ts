"use client";

import { useState, useEffect } from "react";
import { calculateCountdown } from "@/lib/utils";
import type { CountdownTime } from "@/types";

const PLACEHOLDER: CountdownTime = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isExpired: false,
};

/**
 * Real-time countdown to a target date.
 *
 * Renders zeros on server, swaps to real values after mount to avoid
 * hydration mismatch (new Date() differs between SSR and client).
 */
export function useCountdown(targetDate: Date): CountdownTime {
  const [time, setTime] = useState<CountdownTime>(PLACEHOLDER);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration gate
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- time sync
    setTime(calculateCountdown(targetDate));

    const interval = setInterval(() => {
      setTime(calculateCountdown(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, hydrated]);

  return time;
}
