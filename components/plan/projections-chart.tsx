"use client";

import type { MonthProjection } from "@/lib/projections";
import type { PlanAnswers } from "@/types";

interface Props {
  projections: MonthProjection[];
  answers: PlanAnswers;
}

export function ProjectionsChart({ projections, answers }: Props) {
  const target = 500;
  const maxRevenue = Math.max(...projections.map((p) => p.revenue), target) * 1.1;
  const finalMonth = projections[projections.length - 1];

  return (
    <div className="space-y-8">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          label="Month 6 Revenue"
          value={`£${finalMonth.revenue}`}
          sub={`Target: £${target}`}
          hit={finalMonth.revenue >= target}
        />
        <SummaryCard
          label="Month 6 Profit"
          value={`£${finalMonth.profit}`}
          sub={`${answers.goals_profit_margin}% margin`}
        />
        <SummaryCard
          label="Effective Hourly Rate"
          value={`£${finalMonth.hourly_rate.toFixed(2)}`}
          sub={`at ${finalMonth.hours} hrs/month`}
        />
        <SummaryCard
          label="Items Sold (Month 6)"
          value={`${finalMonth.items_sold}`}
          sub="per month"
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6">
        <h3 className="font-semibold text-zinc-900 mb-6">6-Month Revenue Projection</h3>
        <div className="relative h-64">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-zinc-400 w-10">
            <span>£{Math.round(maxRevenue)}</span>
            <span>£{Math.round(maxRevenue / 2)}</span>
            <span>£0</span>
          </div>

          {/* Bars */}
          <div className="ml-12 flex items-end gap-3 h-56">
            {projections.map((p) => {
              const height = (p.revenue / maxRevenue) * 100;
              const profitHeight = (p.profit / maxRevenue) * 100;
              return (
                <div key={p.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-zinc-700">£{p.revenue}</span>
                  <div className="w-full relative" style={{ height: `${height}%` }}>
                    <div className="absolute inset-0 bg-rose-200 rounded-t-lg" />
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-rose-500 rounded-t-lg"
                      style={{ height: `${(profitHeight / height) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-400">{p.label}</span>
                </div>
              );
            })}
          </div>

          {/* Target line */}
          <div
            className="absolute left-12 right-0 border-t-2 border-dashed border-amber-400"
            style={{ bottom: `${(target / maxRevenue) * 224 + 32}px` }}
          >
            <span className="absolute -top-5 right-0 text-xs text-amber-600 font-medium">
              £{target} target
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-rose-500 rounded" />
            Profit
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-rose-200 rounded" />
            Revenue
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 border-t-2 border-dashed border-amber-400" />
            Target
          </div>
        </div>
      </div>

      {/* Monthly breakdown table */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        <h3 className="font-semibold text-zinc-900 px-6 pt-5 pb-3">Monthly Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-zinc-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-2 text-left">Month</th>
                <th className="px-4 py-2 text-right">Revenue</th>
                <th className="px-4 py-2 text-right">Costs</th>
                <th className="px-4 py-2 text-right">Profit</th>
                <th className="px-4 py-2 text-right">Items Sold</th>
                <th className="px-4 py-2 text-right">£/hour</th>
              </tr>
            </thead>
            <tbody>
              {projections.map((p) => (
                <tr key={p.month} className="border-b border-zinc-50 hover:bg-zinc-50/50">
                  <td className="px-6 py-3 font-medium text-zinc-900">{p.label}</td>
                  <td className="px-4 py-3 text-right text-zinc-700">£{p.revenue}</td>
                  <td className="px-4 py-3 text-right text-zinc-500">£{p.costs}</td>
                  <td className="px-4 py-3 text-right font-medium text-emerald-600">£{p.profit}</td>
                  <td className="px-4 py-3 text-right text-zinc-700">{p.items_sold}</td>
                  <td className="px-4 py-3 text-right text-zinc-500">£{p.hourly_rate.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, sub, hit }: { label: string; value: string; sub: string; hit?: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-4">
      <p className="text-xs text-zinc-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-zinc-900">{value}</p>
      <p className={`text-xs mt-1 ${hit ? "text-emerald-600" : "text-zinc-400"}`}>
        {hit && "✓ "}{sub}
      </p>
    </div>
  );
}
