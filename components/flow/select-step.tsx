"use client";

import type { Step } from "@/types";
import { cn } from "@/lib/utils";

interface SelectStepProps {
  step: Step;
  value: string;
  onChange: (value: string) => void;
}

export function SelectStep({ step, value, onChange }: SelectStepProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {step.options?.map((option, i) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200",
            "hover:border-rose-300 hover:bg-rose-50/50",
            value === option.value
              ? "border-rose-500 bg-rose-50 shadow-sm"
              : "border-zinc-200 bg-white"
          )}
        >
          <span
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium shrink-0",
              value === option.value
                ? "bg-rose-500 text-white"
                : "bg-zinc-100 text-zinc-500"
            )}
          >
            {String.fromCharCode(65 + i)}
          </span>
          <div>
            <p className="font-medium text-zinc-900">{option.label}</p>
            {option.description && (
              <p className="text-sm text-zinc-500 mt-0.5">
                {option.description}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
