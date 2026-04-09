"use client";

import { useEffect, useRef } from "react";
import { usePlanStore } from "@/store/plan-store";
import { AUTO_SAVE_DELAY_MS } from "@/lib/constants";

export function useAutoSave() {
  const { answers, currentStep } = usePlanStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevRef = useRef<string>("");

  useEffect(() => {
    const serialized = JSON.stringify({ answers, currentStep });
    if (serialized === prevRef.current) return;
    prevRef.current = serialized;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      try {
        await fetch("/api/plan", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, currentStep }),
        });
      } catch {
        // Silently fail — localStorage is the fallback
      }
    }, AUTO_SAVE_DELAY_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [answers, currentStep]);
}
