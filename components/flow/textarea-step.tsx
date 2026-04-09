"use client";

import type { Step } from "@/types";
import { Textarea } from "@/components/ui/textarea";

interface TextareaStepProps {
  step: Step;
  value: string;
  onChange: (value: string) => void;
}

export function TextareaStep({ step, value, onChange }: TextareaStepProps) {
  return (
    <Textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={step.placeholder}
      rows={4}
      className="text-lg border-0 border-b-2 border-zinc-200 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-rose-500 transition-colors resize-none placeholder:text-zinc-400"
      autoFocus
    />
  );
}
