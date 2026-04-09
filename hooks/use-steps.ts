"use client";

import { useEffect, useState } from "react";
import { steps as defaultSteps } from "@/config/steps";
import type { Step } from "@/types";

export function useSteps() {
  const [steps, setSteps] = useState<Step[]>(defaultSteps);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/steps");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSteps(data);
        }
      } catch {
        // Fall back to static config
      }
      setLoading(false);
    })();
  }, []);

  return { steps, loading };
}
