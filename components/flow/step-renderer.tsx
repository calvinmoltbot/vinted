"use client";

import type { Step, AnswerValue } from "@/types";
import { TextStep } from "./text-step";
import { TextareaStep } from "./textarea-step";
import { SelectStep } from "./select-step";
import { MultiSelectStep } from "./multi-select-step";
import { NumberStep } from "./number-step";
import { SliderStep } from "./slider-step";
import { RatingStep } from "./rating-step";
import { SectionIntro } from "./section-intro";

interface StepRendererProps {
  step: Step;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
}

export function StepRenderer({ step, value, onChange }: StepRendererProps) {
  switch (step.type) {
    case "section-intro":
      return <SectionIntro step={step} />;
    case "text":
      return (
        <TextStep
          step={step}
          value={(value as string) || ""}
          onChange={onChange}
        />
      );
    case "textarea":
      return (
        <TextareaStep
          step={step}
          value={(value as string) || ""}
          onChange={onChange}
        />
      );
    case "select":
      return (
        <SelectStep
          step={step}
          value={(value as string) || ""}
          onChange={(v) => onChange(v)}
        />
      );
    case "multi-select":
      return (
        <MultiSelectStep
          step={step}
          value={(value as string[]) || []}
          onChange={(v) => onChange(v)}
        />
      );
    case "number":
      return (
        <NumberStep
          step={step}
          value={(value as number) ?? ""}
          onChange={(v) => onChange(v)}
        />
      );
    case "slider":
      return (
        <SliderStep
          step={step}
          value={(value as number) ?? step.min ?? 0}
          onChange={(v) => onChange(v)}
        />
      );
    case "rating":
      return (
        <RatingStep
          step={step}
          value={(value as number) ?? 0}
          onChange={(v) => onChange(v)}
        />
      );
    default:
      return null;
  }
}
