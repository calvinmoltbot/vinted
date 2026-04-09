"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  TrendingUp,
  Settings,
  Rocket,
  ArrowRight,
} from "lucide-react";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const sections = [
  {
    icon: ShoppingBag,
    label: "Core Business",
    desc: "What you sell & who buys it",
    color: "bg-rose-100 text-rose-600",
  },
  {
    icon: TrendingUp,
    label: "Goals & Financials",
    desc: "Revenue targets & margins",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: Settings,
    label: "Operations",
    desc: "Your daily workflow & tools",
    color: "bg-sky-100 text-sky-600",
  },
  {
    icon: Rocket,
    label: "Growth & Brand",
    desc: "Scaling & brand identity",
    color: "bg-violet-100 text-violet-600",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 tracking-tight">
              {APP_NAME}
            </h1>
            <p className="text-xl md:text-2xl text-zinc-500 font-light">
              {APP_TAGLINE}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/flow">
              <Button
                size="lg"
                className="bg-rose-500 hover:bg-rose-600 text-white text-lg px-10 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Start Your Business Plan
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8"
          >
            {sections.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white border border-zinc-100 shadow-sm"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center`}
                >
                  <s.icon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-zinc-900 text-sm">
                    {s.label}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-sm text-zinc-400"
          >
            Takes about 5 minutes. Your answers are saved automatically.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
