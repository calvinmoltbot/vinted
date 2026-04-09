"use client";

import { TrendingUp, Zap, Palette, ShoppingBag } from "lucide-react";
import type { GrowthStrategy } from "@/lib/projections";
import { cn } from "@/lib/utils";

interface Props {
  strategies: GrowthStrategy[];
}

const categoryConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  revenue: { icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100" },
  efficiency: { icon: Zap, color: "text-amber-600", bg: "bg-amber-100" },
  brand: { icon: Palette, color: "text-violet-600", bg: "bg-violet-100" },
  sourcing: { icon: ShoppingBag, color: "text-sky-600", bg: "bg-sky-100" },
};

const effortColors: Record<string, string> = {
  Low: "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-red-100 text-red-700",
};

export function StrategyCards({ strategies }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Growth Strategies</h2>
        <p className="text-zinc-500 mt-1">
          Personalised recommendations based on your business plan. Sorted by impact and effort.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strategies.map((s) => {
          const config = categoryConfig[s.category] || categoryConfig.revenue;
          const Icon = config.icon;

          return (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", config.bg)}>
                  <Icon className={cn("w-5 h-5", config.color)} />
                </div>
                <span className={cn("px-2 py-0.5 text-xs rounded-full font-medium", effortColors[s.effort])}>
                  {s.effort} effort
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-zinc-900">{s.title}</h3>
                <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="bg-zinc-50 rounded-lg px-3 py-2">
                <p className="text-xs text-zinc-400">Expected impact</p>
                <p className="text-sm font-medium text-zinc-900">{s.impact}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
