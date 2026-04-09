"use client";

import { Slider } from "@/components/ui/slider";
import type { MonthProjection, ScenarioOverrides } from "@/lib/projections";
import type { PlanAnswers } from "@/types";

interface Props {
  overrides: ScenarioOverrides;
  setOverrides: (o: ScenarioOverrides) => void;
  projections: MonthProjection[];
  baseProjections: MonthProjection[];
  answers: PlanAnswers;
}

export function WhatIfExplorer({ overrides, setOverrides, projections, baseProjections }: Props) {
  const finalBase = baseProjections[baseProjections.length - 1];
  const finalScenario = projections[projections.length - 1];
  const revenueDiff = finalScenario.revenue - finalBase.revenue;
  const profitDiff = finalScenario.profit - finalBase.profit;

  const update = (key: keyof ScenarioOverrides, val: number) => {
    setOverrides({ ...overrides, [key]: val });
  };

  return (
    <div className="space-y-8">
      {/* Impact summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ImpactCard
          label="Month 6 Revenue"
          base={finalBase.revenue}
          scenario={finalScenario.revenue}
        />
        <ImpactCard
          label="Month 6 Profit"
          base={finalBase.profit}
          scenario={finalScenario.profit}
        />
        <ImpactCard
          label="Items Sold"
          base={finalBase.items_sold}
          scenario={finalScenario.items_sold}
          prefix=""
        />
        <ImpactCard
          label="Hourly Rate"
          base={finalBase.hourly_rate}
          scenario={finalScenario.hourly_rate}
          decimals={2}
        />
      </div>

      {/* Sliders */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-8">
        <h3 className="font-semibold text-zinc-900">Adjust Assumptions</h3>

        <SliderRow
          label="Price change"
          value={overrides.priceChangePercent}
          min={-30}
          max={50}
          step={5}
          format={(v) => `${v >= 0 ? "+" : ""}${v}%`}
          onChange={(v) => update("priceChangePercent", v)}
          description="What if you raised (or lowered) your prices?"
        />

        <SliderRow
          label="Additional platforms"
          value={overrides.additionalPlatforms}
          min={0}
          max={3}
          step={1}
          format={(v) => v === 0 ? "Vinted only" : `+${v} platform${v > 1 ? "s" : ""}`}
          onChange={(v) => update("additionalPlatforms", v)}
          description="Each platform adds ~25% more buyer reach"
        />

        <SliderRow
          label="Items sourced per month"
          value={overrides.monthlyItemsSourced}
          min={5}
          max={60}
          step={5}
          format={(v) => `${v} items`}
          onChange={(v) => update("monthlyItemsSourced", v)}
          description="How many items you find and list each month"
        />

        <SliderRow
          label="Sell-through rate"
          value={overrides.sellThroughRate}
          min={20}
          max={80}
          step={5}
          format={(v) => `${v}%`}
          onChange={(v) => update("sellThroughRate", v)}
          description="What % of listed items actually sell"
        />

        <SliderRow
          label="Hours per week"
          value={overrides.hoursPerWeek}
          min={5}
          max={40}
          step={1}
          format={(v) => `${v} hrs`}
          onChange={(v) => update("hoursPerWeek", v)}
          description="Time you dedicate weekly"
        />

        <SliderRow
          label="Monthly costs"
          value={overrides.monthlyCosts}
          min={0}
          max={100}
          step={5}
          format={(v) => `£${v}`}
          onChange={(v) => update("monthlyCosts", v)}
          description="Shipping, packaging, supplies"
        />
      </div>

      {/* Side-by-side comparison */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        <h3 className="font-semibold text-zinc-900 px-6 pt-5 pb-3">Base vs Scenario</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-zinc-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-2 text-left">Month</th>
                <th className="px-4 py-2 text-right">Base Revenue</th>
                <th className="px-4 py-2 text-right">Scenario Revenue</th>
                <th className="px-4 py-2 text-right">Difference</th>
              </tr>
            </thead>
            <tbody>
              {projections.map((p, i) => {
                const diff = p.revenue - baseProjections[i].revenue;
                return (
                  <tr key={p.month} className="border-b border-zinc-50">
                    <td className="px-6 py-3 font-medium text-zinc-900">{p.label}</td>
                    <td className="px-4 py-3 text-right text-zinc-500">£{baseProjections[i].revenue}</td>
                    <td className="px-4 py-3 text-right font-medium text-zinc-900">£{p.revenue}</td>
                    <td className={`px-4 py-3 text-right font-medium ${diff >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {diff >= 0 ? "+" : ""}£{diff}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
  description,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-zinc-900 text-sm">{label}</p>
          <p className="text-xs text-zinc-400">{description}</p>
        </div>
        <span className="text-lg font-semibold text-rose-600 min-w-[80px] text-right">
          {format(value)}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(val) => onChange(Array.isArray(val) ? val[0] : val)}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}

function ImpactCard({
  label,
  base,
  scenario,
  prefix = "£",
  decimals = 0,
}: {
  label: string;
  base: number;
  scenario: number;
  prefix?: string;
  decimals?: number;
}) {
  const diff = scenario - base;
  const pct = base > 0 ? Math.round((diff / base) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-4">
      <p className="text-xs text-zinc-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-zinc-900">
        {prefix}{scenario.toFixed(decimals)}
      </p>
      {diff !== 0 && (
        <p className={`text-xs mt-1 font-medium ${diff >= 0 ? "text-emerald-600" : "text-red-500"}`}>
          {diff >= 0 ? "+" : ""}{prefix}{diff.toFixed(decimals)} ({pct >= 0 ? "+" : ""}{pct}%)
        </p>
      )}
    </div>
  );
}
