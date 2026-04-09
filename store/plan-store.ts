"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlanAnswers, AnswerValue } from "@/types";
import { PLAN_STORAGE_KEY } from "@/lib/constants";
import { steps } from "@/config/steps";

interface PlanStore {
  answers: PlanAnswers;
  currentStep: number;
  completed: boolean;
  _hydrated: boolean;

  setAnswer: (stepId: string, value: AnswerValue) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  setCompleted: () => void;
  reset: () => void;
}

export const usePlanStore = create<PlanStore>()(
  persist(
    (set) => ({
      answers: {},
      currentStep: 0,
      completed: false,
      _hydrated: false,

      setAnswer: (stepId, value) =>
        set((state) => ({
          answers: { ...state.answers, [stepId]: value },
        })),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, steps.length - 1),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0),
        })),

      goToStep: (index) =>
        set({ currentStep: Math.max(0, Math.min(index, steps.length - 1)) }),

      setCompleted: () => set({ completed: true }),

      reset: () => set({ answers: {}, currentStep: 0, completed: false }),
    }),
    {
      name: PLAN_STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
        if (state) state._hydrated = true;
      },
    }
  )
);
