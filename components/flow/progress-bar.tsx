"use client";

import { motion } from "framer-motion";
import { steps } from "@/config/steps";

interface ProgressBarProps {
  currentStep: number;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-zinc-100">
      <motion.div
        className="h-full bg-gradient-to-r from-rose-500 to-amber-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
  );
}
