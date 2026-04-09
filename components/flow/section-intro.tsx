"use client";

import type { Step } from "@/types";
import { SECTION_META } from "@/types";
import {
  ShoppingBag,
  TrendingUp,
  Settings,
  Rocket,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShoppingBag,
  TrendingUp,
  Settings,
  Rocket,
};

interface SectionIntroProps {
  step: Step;
}

export function SectionIntro({ step }: SectionIntroProps) {
  const meta = SECTION_META[step.section];
  const Icon = iconMap[meta.icon];

  const colorClasses: Record<string, string> = {
    rose: "from-rose-500 to-rose-600",
    amber: "from-amber-500 to-amber-600",
    sky: "from-sky-500 to-sky-600",
    violet: "from-violet-500 to-violet-600",
  };

  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <div
        className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colorClasses[meta.color]} flex items-center justify-center shadow-lg`}
      >
        {Icon && <Icon className="w-10 h-10 text-white" />}
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wider text-zinc-400">
          {meta.label}
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold text-zinc-900">
          {step.question}
        </h2>
        {step.subtitle && (
          <p className="text-lg text-zinc-500 max-w-md">{step.subtitle}</p>
        )}
      </div>
    </div>
  );
}
