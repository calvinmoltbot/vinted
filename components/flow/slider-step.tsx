"use client";

import type { Step } from "@/types";
import { Slider } from "@/components/ui/slider";

interface SliderStepProps {
  step: Step;
  value: number;
  onChange: (value: number) => void;
}

export function SliderStep({ step, value, onChange }: SliderStepProps) {
  const min = step.min ?? 0;
  const max = step.max ?? 100;
  const stepSize = step.step ?? 1;
  const current = value ?? Math.round((min + max) / 2);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <span className="text-5xl font-light text-rose-500">{current}</span>
        {step.suffix && (
          <span className="text-xl text-zinc-400 ml-2">{step.suffix}</span>
        )}
      </div>
      <Slider
        value={[current]}
        onValueChange={(val) => onChange(Array.isArray(val) ? val[0] : val)}
        min={min}
        max={max}
        step={stepSize}
        className="w-full"
      />
      <div className="flex justify-between text-sm text-zinc-400">
        <span>
          {min}
          {step.suffix ? ` ${step.suffix}` : ""}
        </span>
        <span>
          {max}
          {step.suffix ? ` ${step.suffix}` : ""}
        </span>
      </div>
    </div>
  );
}
