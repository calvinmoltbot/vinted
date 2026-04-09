"use client";

import type { Step } from "@/types";
import { cn } from "@/lib/utils";

interface MultiSelectStepProps {
  step: Step;
  value: string[];
  onChange: (value: string[]) => void;
}

export function MultiSelectStep({
  step,
  value,
  onChange,
}: MultiSelectStepProps) {
  const selected = value || [];

  const toggle = (optionValue: string) => {
    if (selected.includes(optionValue)) {
      onChange(selected.filter((v) => v !== optionValue));
    } else {
      onChange([...selected, optionValue]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {step.options?.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <button
            key={option.value}
            onClick={() => toggle(option.value)}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200",
              "hover:border-rose-300 hover:bg-rose-50/50",
              isSelected
                ? "border-rose-500 bg-rose-50 shadow-sm"
                : "border-zinc-200 bg-white"
            )}
          >
            <span
              className={cn(
                "flex items-center justify-center w-6 h-6 rounded-md border-2 shrink-0 transition-colors",
                isSelected
                  ? "border-rose-500 bg-rose-500 text-white"
                  : "border-zinc-300"
              )}
            >
              {isSelected && (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </span>
            <p className="font-medium text-zinc-900">{option.label}</p>
          </button>
        );
      })}
    </div>
  );
}
