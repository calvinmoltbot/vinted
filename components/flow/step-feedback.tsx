"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepFeedbackProps {
  stepId: string;
}

const feedbackTypes = [
  { value: "confusing", label: "Confusing question" },
  { value: "not-relevant", label: "Not relevant" },
  { value: "missing-option", label: "Missing an option" },
  { value: "suggestion", label: "Suggestion" },
];

export function StepFeedback({ stepId }: StepFeedbackProps) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!selectedType) return;

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stepId,
          type: selectedType,
          message: message || null,
        }),
      });
    } catch {
      // Silently fail
    }

    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
      setSelectedType(null);
      setMessage("");
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-600">
        <Check className="w-4 h-4" />
        Thanks for the feedback!
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-zinc-500 transition-colors"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        Feedback on this question
      </button>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-700">
          What&apos;s the issue?
        </p>
        <button
          onClick={() => setOpen(false)}
          className="text-zinc-400 hover:text-zinc-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {feedbackTypes.map((ft) => (
          <button
            key={ft.value}
            onClick={() => setSelectedType(ft.value)}
            className={cn(
              "px-3 py-1.5 text-xs rounded-lg border transition-colors",
              selectedType === ft.value
                ? "border-rose-500 bg-rose-50 text-rose-700"
                : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
            )}
          >
            {ft.label}
          </button>
        ))}
      </div>

      {selectedType && (
        <>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us more (optional)..."
            rows={2}
            className="w-full text-sm border border-zinc-200 rounded-lg p-2 resize-none focus:outline-none focus:border-rose-300 placeholder:text-zinc-400"
          />
          <button
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-rose-500 text-white text-sm rounded-lg hover:bg-rose-600 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            Submit
          </button>
        </>
      )}
    </div>
  );
}
