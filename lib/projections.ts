import type { PlanAnswers } from "@/types";

export interface MonthProjection {
  month: number;
  label: string;
  revenue: number;
  costs: number;
  profit: number;
  items_sold: number;
  inventory_size: number;
  hours: number;
  hourly_rate: number;
}

export interface ScenarioOverrides {
  priceChangePercent: number;       // e.g. +10 = raise prices 10%
  additionalPlatforms: number;      // each platform adds ~30% reach
  monthlyItemsSourced: number;      // items sourced per month
  sellThroughRate: number;          // % of listed items that sell (0-100)
  hoursPerWeek: number;
  monthlyCosts: number;
}

export function getDefaults(answers: PlanAnswers): ScenarioOverrides {
  return {
    priceChangePercent: 0,
    additionalPlatforms: 0,
    monthlyItemsSourced: 15,
    sellThroughRate: 45,
    hoursPerWeek: (answers.ops_hours as number) || 22,
    monthlyCosts: (answers.goals_monthly_costs as number) || 10,
  };
}

export function calculateProjections(
  answers: PlanAnswers,
  overrides: ScenarioOverrides,
  months: number = 6
): MonthProjection[] {
  const currentRevenue = (answers.goals_monthly_revenue as number) || 150;
  const targetRevenue = 500;
  const marginTarget = ((answers.goals_profit_margin as number) || 35) / 100;

  // Base avg sale price derived from current revenue / estimated monthly sales
  const baseAvgPrice = 12; // reasonable for vintage clothing + books
  const priceMultiplier = 1 + overrides.priceChangePercent / 100;
  const avgSalePrice = baseAvgPrice * priceMultiplier;

  // Platform multiplier — each extra platform adds ~25% effective reach
  const platformMultiplier = 1 + overrides.additionalPlatforms * 0.25;

  // Monthly growth rate to get from current to target over 6 months
  const baseGrowthRate = Math.pow(targetRevenue / currentRevenue, 1 / 6) - 1;

  const projections: MonthProjection[] = [];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();

  for (let i = 0; i < months; i++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const label = `${monthNames[monthDate.getMonth()]} ${monthDate.getFullYear()}`;

    // Items available = sourced items * cumulative (with some rolling inventory)
    const itemsAvailable = overrides.monthlyItemsSourced * (1 + i * 0.1); // slight growth in sourcing efficiency
    const itemsSold = Math.round(itemsAvailable * (overrides.sellThroughRate / 100) * platformMultiplier);

    // Revenue grows with organic growth + scenario adjustments
    const organicGrowth = Math.pow(1 + baseGrowthRate, i);
    const revenue = Math.round(itemsSold * avgSalePrice * organicGrowth);

    // Costs scale modestly with volume
    const costs = Math.round(overrides.monthlyCosts * (1 + i * 0.05));

    const profit = Math.round(revenue * marginTarget - costs);
    const monthlyHours = overrides.hoursPerWeek * 4.33;
    const hourlyRate = monthlyHours > 0 ? profit / monthlyHours : 0;

    projections.push({
      month: i + 1,
      label,
      revenue,
      costs,
      profit: Math.max(0, profit),
      items_sold: itemsSold,
      inventory_size: Math.round(itemsAvailable - itemsSold + (i > 0 ? projections[i - 1].inventory_size * 0.3 : 0)),
      hours: Math.round(monthlyHours),
      hourly_rate: Math.round(hourlyRate * 100) / 100,
    });
  }

  return projections;
}

export interface GrowthStrategy {
  id: string;
  title: string;
  description: string;
  impact: string;
  effort: "Low" | "Medium" | "High";
  category: "revenue" | "efficiency" | "brand" | "sourcing";
}

export function generateStrategies(answers: PlanAnswers): GrowthStrategy[] {
  const strategies: GrowthStrategy[] = [];

  // Platform expansion
  const platforms = (answers.growth_platforms as string[]) || [];
  if (platforms.length <= 1) {
    strategies.push({
      id: "cross-list",
      title: "Cross-list to Depop & eBay",
      description: "You're only on Vinted. Each additional platform exposes your items to a completely new audience. Depop skews younger and fashion-forward — perfect for your vintage clothing.",
      impact: "+25-40% more sales per platform added",
      effort: "Medium",
      category: "revenue",
    });
  }

  // Photography
  if (answers.ops_photography === "phone-natural") {
    strategies.push({
      id: "ring-light",
      title: "Upgrade to a ring light (£15-25)",
      description: "Consistent lighting is the #1 factor in listing click-through rates. Natural light is great but inconsistent. A ring light lets you photograph any time of day with the same quality.",
      impact: "+15-20% more views per listing",
      effort: "Low",
      category: "efficiency",
    });
  }

  // Inventory tracking
  if (answers.ops_inventory === "memory") {
    strategies.push({
      id: "track-inventory",
      title: "Start tracking inventory properly",
      description: "Tracking stock 'in your head' works until it doesn't. You'll lose track of what you paid, miss relisting opportunities, and can't calculate true profit. Even a simple spreadsheet is a massive step up.",
      impact: "Prevents lost stock, enables profit tracking",
      effort: "Low",
      category: "efficiency",
    });
  }

  // Pricing strategy
  if (answers.core_pricing === "brand-value" || answers.core_pricing === "gut-feeling") {
    strategies.push({
      id: "market-research",
      title: "Research sold prices before listing",
      description: "Search Vinted for similar items that have sold (filter by 'sold'). This tells you the real market price. You might be underpricing — or overpricing and waiting longer than needed.",
      impact: "+10-15% average sale price",
      effort: "Low",
      category: "revenue",
    });
  }

  // Bundle strategy
  strategies.push({
    id: "bundles",
    title: "Offer bundle discounts",
    description: "Encourage buyers to purchase multiple items. '10% off 2+ items' increases order value and reduces per-item shipping effort. Curate matching outfits or themed bundles to leverage your 'vibe' curation.",
    impact: "+20-30% increase in order value",
    effort: "Low",
    category: "revenue",
  });

  // Brand building
  const brandImportance = (answers.growth_brand_importance as number) || 3;
  if (brandImportance >= 3) {
    strategies.push({
      id: "social-media",
      title: "Start an Instagram or TikTok for Lily Thrift",
      description: "You said you 'curate a vibe' — that's a brand story waiting to be told. Even posting 3x/week showing new finds, styling tips, or packing orders builds an audience that drives sales.",
      impact: "Builds loyal customer base, drives direct traffic",
      effort: "Medium",
      category: "brand",
    });
  }

  // Sourcing diversification
  if (answers.core_sourcing === "mixed") {
    strategies.push({
      id: "wholesale",
      title: "Try wholesale vintage bundles",
      description: "Buying vintage clothing in bulk lots (eBay wholesale, vintage wholesalers) gives you more stock at lower per-item cost. Sort the gems from the filler and your margin improves.",
      impact: "Lower cost per item, more inventory",
      effort: "Medium",
      category: "sourcing",
    });
  }

  // Books niche
  if ((answers.core_what_sells as string)?.toLowerCase().includes("book")) {
    strategies.push({
      id: "books-niche",
      title: "Lean into the books niche",
      description: "Books are lightweight, cheap to post, and have predictable demand. Build a reputation as a go-to for curated book bundles. 'Coffee table books + vintage clothing' is a strong aesthetic combo.",
      impact: "Consistent base revenue, low shipping cost",
      effort: "Low",
      category: "revenue",
    });
  }

  return strategies;
}

export interface Milestone {
  month: number;
  label: string;
  revenueTarget: number;
  itemsTarget: number;
  keyAction: string;
}

export function generateMilestones(answers: PlanAnswers): Milestone[] {
  const current = (answers.goals_monthly_revenue as number) || 150;
  const target = 500;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();

  const milestones: Milestone[] = [];
  const actions = [
    "Set up inventory tracking. List 5 new items/week. Research sold prices before listing.",
    "Start bundle offers. Aim for 2+ items per order. Experiment with pricing.",
    "Cross-list top 20 items to Depop. Start photographing with consistent setup.",
    "Review what's selling and double down. Cut slow-moving categories. Increase sourcing.",
    "Launch social media (Instagram/TikTok). Share 3x/week. Build the Lily Thrift brand.",
    "Evaluate full-time viability. Scale sourcing. Optimise workflow for efficiency.",
  ];

  for (let i = 0; i < 6; i++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const progress = (i + 1) / 6;
    const revenueTarget = Math.round(current + (target - current) * progress);
    const avgPrice = 12;
    const itemsTarget = Math.round(revenueTarget / avgPrice);

    milestones.push({
      month: i + 1,
      label: `${monthNames[monthDate.getMonth()]} ${monthDate.getFullYear()}`,
      revenueTarget,
      itemsTarget,
      keyAction: actions[i],
    });
  }

  return milestones;
}
