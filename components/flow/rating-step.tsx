"use client";

import type { Step } from "@/types";
import { cn } from "@/lib/utils";

interface RatingStepProps {
  step: Step;
  value: number;
  onChange: (value: number) => void;
}

export function RatingStep({ step, value, onChange }: RatingStepProps) {
  const min = step.min ?? 1;
  const max = step.max ?? 5;
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="flex justify-center gap-3">
      {options.map((num) => (
        <button
          key={num}
          onClick={() => onChange(num)}
          className={cn(
            "w-16 h-16 rounded-2xl text-xl font-medium border-2 transition-all duration-200",
            "hover:border-rose-300 hover:scale-105",
            value === num
              ? "border-rose-500 bg-rose-500 text-white shadow-lg scale-110"
              : "border-zinc-200 bg-white text-zinc-600"
          )}
        >
          {num}
        </button>
      ))}
    </div>
  );
}
