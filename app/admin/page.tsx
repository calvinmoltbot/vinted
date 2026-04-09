"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Trash2 } from "lucide-react";
import { steps } from "@/config/steps";
import { APP_NAME } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FeedbackItem {
  id: number;
  stepId: string;
  type: string;
  message: string | null;
  createdAt: string;
}

const typeColors: Record<string, string> = {
  confusing: "bg-amber-100 text-amber-700",
  "not-relevant": "bg-red-100 text-red-700",
  "missing-option": "bg-blue-100 text-blue-700",
  suggestion: "bg-emerald-100 text-emerald-700",
};

const typeLabels: Record<string, string> = {
  confusing: "Confusing",
  "not-relevant": "Not Relevant",
  "missing-option": "Missing Option",
  suggestion: "Suggestion",
};

export default function AdminPage() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFeedback = async () => {
    try {
      const res = await fetch("/api/feedback");
      const data = await res.json();
      setFeedback(data);
    } catch {
      // silent
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  // Group by step
  const grouped = feedback.reduce(
    (acc, item) => {
      if (!acc[item.stepId]) acc[item.stepId] = [];
      acc[item.stepId].push(item);
      return acc;
    },
    {} as Record<string, FeedbackItem[]>
  );

  const stepsWithFeedback = Object.keys(grouped);
  const totalFeedback = feedback.length;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="border-b border-zinc-100 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <ArrowLeft className="w-5 h-5 text-zinc-400 hover:text-zinc-600 transition-colors" />
            </Link>
            <h1 className="text-xl font-semibold text-zinc-900">
              {APP_NAME} — Feedback
            </h1>
          </div>
          <Badge variant="outline" className="text-zinc-500">
            {totalFeedback} item{totalFeedback !== 1 ? "s" : ""}
          </Badge>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {loading ? (
          <p className="text-zinc-400">Loading feedback...</p>
        ) : totalFeedback === 0 ? (
          <div className="text-center py-20 space-y-3">
            <MessageCircle className="w-12 h-12 text-zinc-300 mx-auto" />
            <p className="text-zinc-500 text-lg">No feedback yet</p>
            <p className="text-zinc-400 text-sm">
              Feedback will appear here as users flag questions in the flow.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {stepsWithFeedback.map((stepId) => {
              const step = steps.find((s) => s.id === stepId);
              const items = grouped[stepId];

              return (
                <div
                  key={stepId}
                  className="bg-white rounded-xl border border-zinc-200 overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/50">
                    <p className="text-xs text-zinc-400 font-mono">{stepId}</p>
                    <p className="font-medium text-zinc-900 mt-1">
                      {step?.question ?? "Unknown question"}
                    </p>
                  </div>
                  <div className="divide-y divide-zinc-100">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="px-5 py-3 flex items-start gap-3"
                      >
                        <span
                          className={`px-2 py-0.5 text-xs rounded-md font-medium shrink-0 ${typeColors[item.type] ?? "bg-zinc-100 text-zinc-600"}`}
                        >
                          {typeLabels[item.type] ?? item.type}
                        </span>
                        <p className="text-sm text-zinc-700 flex-1">
                          {item.message || "—"}
                        </p>
                        <span className="text-xs text-zinc-400 shrink-0">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
