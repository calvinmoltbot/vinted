"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Edit3, Download, RotateCcw, MessageCircle } from "lucide-react";
import { usePlanStore } from "@/store/plan-store";
import { steps } from "@/config/steps";
import { SECTION_META, type Section } from "@/types";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const sectionOrder: Section[] = [
  "core-business",
  "goals-financials",
  "operations",
  "growth-brand",
];

export default function DashboardPage() {
  const router = useRouter();
  const { answers, completed, reset } = usePlanStore();

  const handleReset = async () => {
    if (!window.confirm("Clear all answers and start over? This cannot be undone.")) return;
    try {
      await fetch("/api/plan/reset", { method: "POST" });
    } catch {
      // DB reset failed — still clear local
    }
    reset();
    router.push("/");
  };

  useEffect(() => {
    if (!completed && Object.keys(answers).length === 0) {
      router.push("/");
    }
  }, [completed, answers, router]);

  const getStepsForSection = (section: Section) =>
    steps.filter((s) => s.section === section && s.type !== "section-intro");

  const formatAnswer = (stepId: string, value: unknown): string => {
    if (value === undefined || value === null || value === "") return "—";
    if (Array.isArray(value)) {
      const step = steps.find((s) => s.id === stepId);
      return value
        .map((v) => step?.options?.find((o) => o.value === v)?.label ?? v)
        .join(", ");
    }
    const step = steps.find((s) => s.id === stepId);
    if (step?.options) {
      return step.options.find((o) => o.value === value)?.label ?? String(value);
    }
    if (step?.prefix) return `${step.prefix}${value}`;
    if (step?.suffix) return `${value} ${step.suffix}`;
    return String(value);
  };

  const colorMap: Record<string, string> = {
    rose: "border-rose-200 bg-rose-50/50",
    amber: "border-amber-200 bg-amber-50/50",
    sky: "border-sky-200 bg-sky-50/50",
    violet: "border-violet-200 bg-violet-50/50",
  };

  const headerColorMap: Record<string, string> = {
    rose: "text-rose-600",
    amber: "text-amber-600",
    sky: "text-sky-600",
    violet: "text-violet-600",
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="border-b border-zinc-100 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <ArrowLeft className="w-5 h-5 text-zinc-400 hover:text-zinc-600 transition-colors" />
            </Link>
            <h1 className="text-xl font-semibold text-zinc-900">{APP_NAME}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                Feedback
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button variant="outline" size="sm" disabled className="gap-2">
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-3 mb-10"
        >
          <h2 className="text-3xl font-bold text-zinc-900">
            Your Business Plan
          </h2>
          <p className="text-zinc-500">
            Here&apos;s everything you&apos;ve captured. Click edit on any
            section to make changes.
          </p>
        </motion.div>

        {/* Lean Canvas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sectionOrder.map((section, i) => {
            const meta = SECTION_META[section];
            const sectionSteps = getStepsForSection(section);

            return (
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`rounded-2xl border-2 p-6 ${colorMap[meta.color]}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={`font-semibold text-lg ${headerColorMap[meta.color]}`}
                  >
                    {meta.label}
                  </h3>
                  <Link href={`/edit/${section}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-zinc-400 hover:text-zinc-600"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {sectionSteps.map((step) => (
                    <div key={step.id}>
                      <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
                        {step.question}
                      </p>
                      <p className="text-zinc-800">
                        {formatAnswer(step.id, answers[step.id])}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Key metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            {
              label: "Revenue Target",
              value: answers.goals_monthly_revenue
                ? `£${answers.goals_monthly_revenue}/mo`
                : "—",
            },
            {
              label: "Profit Margin",
              value: answers.goals_profit_margin
                ? `${answers.goals_profit_margin}%`
                : "—",
            },
            {
              label: "Weekly Hours",
              value: answers.ops_hours ? `${answers.ops_hours} hrs` : "—",
            },
            {
              label: "Brand Focus",
              value: answers.growth_brand_importance
                ? `${answers.growth_brand_importance}/5`
                : "—",
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="bg-white rounded-xl border border-zinc-100 p-4 text-center"
            >
              <p className="text-2xl font-bold text-zinc-900">
                {metric.value}
              </p>
              <p className="text-xs text-zinc-400 mt-1">{metric.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
