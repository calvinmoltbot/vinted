"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { usePlanStore } from "@/store/plan-store";
import { StepRenderer } from "@/components/flow/step-renderer";
import { StepFeedback } from "@/components/flow/step-feedback";
import { ProgressBar } from "@/components/flow/progress-bar";
import { useKeyboardNav } from "@/hooks/use-keyboard-nav";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useSteps } from "@/hooks/use-steps";
import { SECTION_META } from "@/types";
import { Button } from "@/components/ui/button";

export default function FlowPage() {
  const router = useRouter();
  const { steps, loading: stepsLoading } = useSteps();
  const { answers, currentStep, setAnswer, nextStep, prevStep, setCompleted } =
    usePlanStore();

  useAutoSave();

  const step = steps[currentStep];
  const value = step ? answers[step.id] ?? "" : "";
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const isIntro = step?.type === "section-intro";

  const hasValue =
    isIntro ||
    !step?.required ||
    (Array.isArray(value) ? value.length > 0 : value !== undefined && value !== "" && value !== 0);

  const handleNext = useCallback(() => {
    if (!hasValue) return;
    if (isLast) {
      setCompleted();
      router.push("/dashboard");
    } else {
      nextStep();
    }
  }, [hasValue, isLast, nextStep, setCompleted, router]);

  const handlePrev = useCallback(() => {
    if (!isFirst) prevStep();
  }, [isFirst, prevStep]);

  useKeyboardNav({ onNext: handleNext, onPrev: handlePrev });

  if (stepsLoading || !step) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  const sectionMeta = SECTION_META[step.section];
  const inputStepIndex = steps
    .slice(0, currentStep + 1)
    .filter((s) => s.type !== "section-intro").length;
  const totalInputSteps = steps.filter(
    (s) => s.type !== "section-intro"
  ).length;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-8 pb-4">
        <button
          onClick={handlePrev}
          disabled={isFirst}
          className="p-2 rounded-lg hover:bg-zinc-100 transition-colors disabled:opacity-0"
          aria-label="Previous step"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-500" />
        </button>
        <div className="text-sm text-zinc-400">
          {!isIntro && (
            <span>
              {inputStepIndex} of {totalInputSteps}
            </span>
          )}
        </div>
        <div className="w-9" />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-32">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-8"
            >
              {!isIntro && (
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                    {sectionMeta.label}
                  </p>
                  <h1 className="text-2xl md:text-3xl font-semibold text-zinc-900 leading-tight">
                    {step.question}
                  </h1>
                  {step.subtitle && (
                    <p className="text-zinc-500">{step.subtitle}</p>
                  )}
                </div>
              )}

              <StepRenderer
                step={step}
                value={value}
                onChange={(val) => setAnswer(step.id, val)}
              />

              {!isIntro && <StepFeedback stepId={step.id} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-stone-50 via-stone-50/95 to-transparent">
        <div className="max-w-xl mx-auto flex justify-end">
          <Button
            onClick={handleNext}
            disabled={!hasValue}
            size="lg"
            className="bg-rose-500 hover:bg-rose-600 text-white px-8 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLast ? (
              <>
                Complete <Check className="w-4 h-4 ml-2" />
              </>
            ) : isIntro ? (
              <>
                Let&apos;s go <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
        {!isIntro && step.type !== "textarea" && (
          <p className="text-center text-xs text-zinc-400 mt-3">
            Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-500 font-mono text-[10px]">Enter ↵</kbd> to continue
          </p>
        )}
      </div>
    </div>
  );
}
