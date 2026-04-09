"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Sliders, Lightbulb, Target } from "lucide-react";
import { usePlanStore } from "@/store/plan-store";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ProjectionsChart } from "@/components/plan/projections-chart";
import { WhatIfExplorer } from "@/components/plan/what-if-explorer";
import { StrategyCards } from "@/components/plan/strategy-cards";
import { MilestoneRoadmap } from "@/components/plan/milestone-roadmap";
import {
  calculateProjections,
  getDefaults,
  generateStrategies,
  generateMilestones,
  type ScenarioOverrides,
} from "@/lib/projections";

type Tab = "projections" | "what-if" | "strategies" | "milestones";

const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "projections", label: "Projections", icon: TrendingUp },
  { id: "what-if", label: "What If", icon: Sliders },
  { id: "strategies", label: "Growth", icon: Lightbulb },
  { id: "milestones", label: "Roadmap", icon: Target },
];

export default function PlanPage() {
  const { answers } = usePlanStore();
  const [activeTab, setActiveTab] = useState<Tab>("projections");
  const [overrides, setOverrides] = useState<ScenarioOverrides>(() => getDefaults(answers));

  const projections = useMemo(
    () => calculateProjections(answers, overrides),
    [answers, overrides]
  );

  const baseProjections = useMemo(
    () => calculateProjections(answers, getDefaults(answers)),
    [answers]
  );

  const strategies = useMemo(() => generateStrategies(answers), [answers]);
  const milestones = useMemo(() => generateMilestones(answers), [answers]);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="border-b border-zinc-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <ArrowLeft className="w-5 h-5 text-zinc-400 hover:text-zinc-600 transition-colors" />
          </Link>
          <h1 className="text-xl font-semibold text-zinc-900">
            {APP_NAME} — Business Plan
          </h1>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-6 flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "border-rose-500 text-rose-600"
                  : "border-transparent text-zinc-400 hover:text-zinc-600"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "projections" && (
            <ProjectionsChart projections={projections} answers={answers} />
          )}
          {activeTab === "what-if" && (
            <WhatIfExplorer
              overrides={overrides}
              setOverrides={setOverrides}
              projections={projections}
              baseProjections={baseProjections}
              answers={answers}
            />
          )}
          {activeTab === "strategies" && (
            <StrategyCards strategies={strategies} />
          )}
          {activeTab === "milestones" && (
            <MilestoneRoadmap milestones={milestones} answers={answers} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
