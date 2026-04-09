"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { usePlanStore } from "@/store/plan-store";
import { steps } from "@/config/steps";
import { SECTION_META, type Section } from "@/types";
import { StepRenderer } from "@/components/flow/step-renderer";
import { Button } from "@/components/ui/button";

export default function EditSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = use(params);
  const router = useRouter();
  const { answers, setAnswer } = usePlanStore();

  const sectionSteps = steps.filter(
    (s) => s.section === section && s.type !== "section-intro"
  );
  const meta = SECTION_META[section as Section];

  if (!meta) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="border-b border-zinc-100 bg-white">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <ArrowLeft className="w-5 h-5 text-zinc-400 hover:text-zinc-600 transition-colors" />
            </Link>
            <h1 className="text-xl font-semibold text-zinc-900">
              Edit: {meta.label}
            </h1>
          </div>
          <Button
            onClick={() => router.push("/dashboard")}
            size="sm"
            className="bg-rose-500 hover:bg-rose-600 text-white gap-2"
          >
            <Save className="w-4 h-4" />
            Done
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-10">
        {sectionSteps.map((step) => (
          <div key={step.id} className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">
                {step.question}
              </h2>
              {step.subtitle && (
                <p className="text-sm text-zinc-500 mt-1">{step.subtitle}</p>
              )}
            </div>
            <StepRenderer
              step={step}
              value={answers[step.id]}
              onChange={(val) => setAnswer(step.id, val)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
