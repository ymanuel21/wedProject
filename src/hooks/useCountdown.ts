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
 * The initial state is a static placeholder (all zeros) so the server HTML
 * and the first client render are identical. After hydration, useEffect fires
 * and replaces the placeholder with actual calculated values, then updates
 * every second.
 *
 * This avoids the hydration mismatch that occurs when `new Date()` is called
 * inside a useState initializer — the server and client would produce
 * different values because time passes between SSR and hydration.
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
