import type { ZodType } from "zod";

export type StepType =
  | "text"
  | "textarea"
  | "select"
  | "multi-select"
  | "number"
  | "slider"
  | "rating"
  | "section-intro";

export type Section =
  | "core-business"
  | "goals-financials"
  | "operations"
  | "growth-brand"
  | "app-wishlist";

export interface StepOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface Step {
  id: string;
  section: Section;
  type: StepType;
  question: string;
  subtitle?: string;
  placeholder?: string;
  options?: StepOption[];
  validation?: ZodType;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  required?: boolean;
}

export type AnswerValue = string | string[] | number;

export interface PlanAnswers {
  [stepId: string]: AnswerValue;
}

export interface BusinessPlan {
  id: string;
  user_id: string;
  answers: PlanAnswers;
  current_step: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export const SECTION_META: Record<
  Section,
  { label: string; color: string; icon: string }
> = {
  "core-business": {
    label: "Core Business",
    color: "rose",
    icon: "ShoppingBag",
  },
  "goals-financials": {
    label: "Goals & Financials",
    color: "amber",
    icon: "TrendingUp",
  },
  operations: {
    label: "Operations",
    color: "sky",
    icon: "Settings",
  },
  "growth-brand": {
    label: "Growth & Brand",
    color: "violet",
    icon: "Rocket",
  },
  "app-wishlist": {
    label: "Your Dream Tool",
    color: "emerald",
    icon: "Sparkles",
  },
};
