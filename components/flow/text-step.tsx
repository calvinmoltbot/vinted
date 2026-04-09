"use client";

import type { Step } from "@/types";
import { Input } from "@/components/ui/input";

interface TextStepProps {
  step: Step;
  value: string;
  onChange: (value: string) => void;
}

export function TextStep({ step, value, onChange }: TextStepProps) {
  return (
    <Input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={step.placeholder}
      className="h-14 text-lg border-0 border-b-2 border-zinc-200 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-rose-500 transition-colors placeholder:text-zinc-400"
      autoFocus
    />
  );
}
