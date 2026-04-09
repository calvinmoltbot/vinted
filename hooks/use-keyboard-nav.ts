"use client";

import { useEffect } from "react";

interface UseKeyboardNavOptions {
  onNext: () => void;
  onPrev: () => void;
  enabled?: boolean;
}

export function useKeyboardNav({
  onNext,
  onPrev,
  enabled = true,
}: UseKeyboardNavOptions) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e: KeyboardEvent) {
      // Don't intercept Enter inside textareas
      const target = e.target as HTMLElement;
      if (target.tagName === "TEXTAREA") return;

      if (e.key === "Enter") {
        e.preventDefault();
        onNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext, onPrev, enabled]);
}
