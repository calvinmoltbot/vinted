"use client";

import { Check, Circle } from "lucide-react";
import type { Milestone } from "@/lib/projections";
import type { PlanAnswers } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  milestones: Milestone[];
  answers: PlanAnswers;
}

export function MilestoneRoadmap({ milestones, answers }: Props) {
  const currentRevenue = (answers.goals_monthly_revenue as number) || 150;
  const target = 500;

  return (
    <div className="space-y-8">
      {/* Progress overview */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">
              £{currentRevenue} → £{target}/month
            </h2>
            <p className="text-zinc-500 text-sm">Your 6-month roadmap to full-time</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-rose-500">
              {Math.round(((target - currentRevenue) / currentRevenue) * 100)}%
            </p>
            <p className="text-xs text-zinc-400">growth needed</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all"
            style={{ width: `${(currentRevenue / target) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-zinc-400 mt-1">
          <span>£{currentRevenue} (now)</span>
          <span>£{target} (6 months)</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {milestones.map((m, i) => {
          const isFirst = i === 0;
          const isLast = i === milestones.length - 1;

          return (
            <div key={m.month} className="flex gap-4">
              {/* Timeline line + dot */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2",
                    isFirst
                      ? "bg-rose-500 border-rose-500 text-white"
                      : isLast
                        ? "bg-amber-500 border-amber-500 text-white"
                        : "bg-white border-zinc-300 text-zinc-500"
                  )}
                >
                  <span className="text-sm font-bold">{m.month}</span>
                </div>
                {!isLast && (
                  <div className="w-0.5 h-full min-h-[40px] bg-zinc-200" />
                )}
              </div>

              {/* Content */}
              <div className="pb-8 flex-1">
                <div className="bg-white rounded-xl border border-zinc-200 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-zinc-900">{m.label}</h3>
                    <span className="text-lg font-bold text-rose-500">£{m.revenueTarget}</span>
                  </div>

                  <div className="flex gap-4 text-sm text-zinc-500 mb-3">
                    <span>Target: {m.itemsTarget} items sold</span>
                    <span>Revenue: £{m.revenueTarget}/mo</span>
                  </div>

                  <div className="bg-zinc-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
                      Key actions this month
                    </p>
                    <p className="text-sm text-zinc-700 leading-relaxed">
                      {m.keyAction}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
