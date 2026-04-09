"use client";

import type { Step } from "@/types";

interface NumberStepProps {
  step: Step;
  value: number | "";
  onChange: (value: number) => void;
}

export function NumberStep({ step, value, onChange }: NumberStepProps) {
  return (
    <div className="flex items-center gap-2">
      {step.prefix && (
        <span className="text-3xl font-light text-zinc-400">{step.prefix}</span>
      )}
      <input
        type="number"
        value={value ?? ""}
        onChange={(e) => {
          const num = parseFloat(e.target.value);
          if (!isNaN(num)) onChange(num);
          else if (e.target.value === "") onChange(0);
        }}
        min={step.min}
        max={step.max}
        placeholder="0"
        className="h-14 text-3xl font-light bg-transparent border-0 border-b-2 border-zinc-200 focus:border-rose-500 focus:outline-none transition-colors w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        autoFocus
      />
      {step.suffix && (
        <span className="text-lg text-zinc-400">{step.suffix}</span>
      )}
    </div>
  );
}
