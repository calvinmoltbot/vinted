"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  Save,
  GripVertical,
  Eye,
  EyeOff,
  Pencil,
  X,
  Check,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Step, Section, StepType, StepOption } from "@/types";
import { SECTION_META } from "@/types";

const STEP_TYPES: { value: StepType; label: string }[] = [
  { value: "text", label: "Short Text" },
  { value: "textarea", label: "Long Text" },
  { value: "select", label: "Single Select" },
  { value: "multi-select", label: "Multi Select" },
  { value: "number", label: "Number" },
  { value: "slider", label: "Slider" },
  { value: "rating", label: "Rating" },
  { value: "section-intro", label: "Section Intro" },
];

const SECTIONS: { value: Section; label: string }[] = [
  { value: "core-business", label: "Core Business" },
  { value: "goals-financials", label: "Goals & Financials" },
  { value: "operations", label: "Operations" },
  { value: "growth-brand", label: "Growth & Brand" },
];

interface DbStep extends Step {
  sort_order?: number;
  active?: boolean;
}

export function QuestionEditor() {
  const [steps, setSteps] = useState<DbStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeded, setSeeded] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<DbStep>>({});
  const [saving, setSaving] = useState(false);
  const [addingNew, setAddingNew] = useState(false);
  const [newStep, setNewStep] = useState<Partial<DbStep>>({
    type: "text",
    section: "core-business",
    required: false,
  });

  const loadSteps = useCallback(async () => {
    try {
      const res = await fetch("/api/steps");
      const data = await res.json();
      setSteps(data);
      setSeeded(data.length > 0);
    } catch {
      // silent
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSteps();
  }, [loadSteps]);

  const seedFromConfig = async () => {
    setSaving(true);
    try {
      await fetch("/api/init", { method: "POST" });
      await fetch("/api/steps", { method: "PUT" });
      await loadSteps();
      setSeeded(true);
    } catch {
      // silent
    }
    setSaving(false);
  };

  const startEdit = (step: DbStep) => {
    setEditingId(step.id);
    setEditForm({ ...step });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      await fetch(`/api/steps/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      await loadSteps();
      setEditingId(null);
      setEditForm({});
    } catch {
      // silent
    }
    setSaving(false);
  };

  const deleteStep = async (id: string) => {
    if (!window.confirm("Delete this question? This cannot be undone.")) return;
    try {
      await fetch(`/api/steps/${id}`, { method: "DELETE" });
      await loadSteps();
    } catch {
      // silent
    }
  };

  const moveStep = async (index: number, direction: "up" | "down") => {
    const newSteps = [...steps];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newSteps.length) return;

    [newSteps[index], newSteps[swapIndex]] = [newSteps[swapIndex], newSteps[index]];
    setSteps(newSteps);

    try {
      await fetch("/api/steps/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: newSteps.map((s) => s.id) }),
      });
    } catch {
      await loadSteps(); // revert on failure
    }
  };

  const addStep = async () => {
    if (!newStep.question || !newStep.id) return;
    setSaving(true);
    try {
      await fetch("/api/steps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newStep,
          sort_order: steps.length,
        }),
      });
      await loadSteps();
      setAddingNew(false);
      setNewStep({ type: "text", section: "core-business", required: false });
    } catch {
      // silent
    }
    setSaving(false);
  };

  const sectionColor: Record<string, string> = {
    "core-business": "bg-rose-100 text-rose-700",
    "goals-financials": "bg-amber-100 text-amber-700",
    operations: "bg-sky-100 text-sky-700",
    "growth-brand": "bg-violet-100 text-violet-700",
  };

  const typeColor: Record<string, string> = {
    "section-intro": "bg-zinc-800 text-white",
    text: "bg-zinc-100 text-zinc-600",
    textarea: "bg-zinc-100 text-zinc-600",
    select: "bg-blue-100 text-blue-700",
    "multi-select": "bg-blue-100 text-blue-700",
    number: "bg-emerald-100 text-emerald-700",
    slider: "bg-emerald-100 text-emerald-700",
    rating: "bg-purple-100 text-purple-700",
  };

  if (loading) {
    return <p className="text-zinc-400">Loading questions...</p>;
  }

  if (!seeded) {
    return (
      <div className="text-center py-20 space-y-4">
        <Database className="w-12 h-12 text-zinc-300 mx-auto" />
        <p className="text-zinc-500 text-lg">Questions not in database yet</p>
        <p className="text-zinc-400 text-sm">
          Seed the database from the current config to start editing.
        </p>
        <Button onClick={seedFromConfig} disabled={saving} className="bg-rose-500 hover:bg-rose-600 text-white">
          {saving ? "Seeding..." : "Seed from config"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Question list */}
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={cn(
            "bg-white rounded-xl border border-zinc-200 overflow-hidden",
            step.type === "section-intro" && "border-l-4 border-l-zinc-800"
          )}
        >
          {editingId === step.id ? (
            /* ── Edit mode ── */
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-mono text-zinc-400">{step.id}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={cancelEdit}>
                    <X className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveEdit}
                    disabled={saving}
                    className="bg-rose-500 hover:bg-rose-600 text-white gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-zinc-500 mb-1 block">Type</label>
                  <select
                    value={editForm.type || "text"}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value as StepType })}
                    className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm"
                  >
                    {STEP_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-500 mb-1 block">Section</label>
                  <select
                    value={editForm.section || "core-business"}
                    onChange={(e) => setEditForm({ ...editForm, section: e.target.value as Section })}
                    className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm"
                  >
                    {SECTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-500 mb-1 block">Question</label>
                <Input
                  value={editForm.question || ""}
                  onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-500 mb-1 block">Subtitle</label>
                <Input
                  value={editForm.subtitle || ""}
                  onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                  placeholder="Optional helper text"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-500 mb-1 block">Placeholder</label>
                <Input
                  value={editForm.placeholder || ""}
                  onChange={(e) => setEditForm({ ...editForm, placeholder: e.target.value })}
                  placeholder="Optional placeholder text"
                />
              </div>

              {(editForm.type === "select" || editForm.type === "multi-select") && (
                <div>
                  <label className="text-xs font-medium text-zinc-500 mb-1 block">
                    Options (one per line: value | label)
                  </label>
                  <Textarea
                    value={
                      (editForm.options || [])
                        .map((o: StepOption) => `${o.value} | ${o.label}`)
                        .join("\n") || ""
                    }
                    onChange={(e) => {
                      const options = e.target.value
                        .split("\n")
                        .filter((l) => l.trim())
                        .map((line) => {
                          const [value, ...rest] = line.split("|");
                          return {
                            value: value.trim(),
                            label: rest.join("|").trim() || value.trim(),
                          };
                        });
                      setEditForm({ ...editForm, options });
                    }}
                    rows={4}
                    placeholder="value | Label text"
                    className="font-mono text-sm"
                  />
                </div>
              )}

              {(editForm.type === "number" || editForm.type === "slider" || editForm.type === "rating") && (
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-1 block">Min</label>
                    <Input
                      type="number"
                      value={editForm.min ?? ""}
                      onChange={(e) => setEditForm({ ...editForm, min: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-1 block">Max</label>
                    <Input
                      type="number"
                      value={editForm.max ?? ""}
                      onChange={(e) => setEditForm({ ...editForm, max: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-1 block">Prefix</label>
                    <Input
                      value={editForm.prefix || ""}
                      onChange={(e) => setEditForm({ ...editForm, prefix: e.target.value })}
                      placeholder="£"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-1 block">Suffix</label>
                    <Input
                      value={editForm.suffix || ""}
                      onChange={(e) => setEditForm({ ...editForm, suffix: e.target.value })}
                      placeholder="%"
                    />
                  </div>
                </div>
              )}

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editForm.required ?? false}
                  onChange={(e) => setEditForm({ ...editForm, required: e.target.checked })}
                  className="rounded"
                />
                Required
              </label>
            </div>
          ) : (
            /* ── View mode ── */
            <div className="px-5 py-3 flex items-center gap-3">
              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  onClick={() => moveStep(index, "up")}
                  disabled={index === 0}
                  className="p-0.5 text-zinc-300 hover:text-zinc-600 disabled:opacity-0 transition-colors"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveStep(index, "down")}
                  disabled={index === steps.length - 1}
                  className="p-0.5 text-zinc-300 hover:text-zinc-600 disabled:opacity-0 transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn("px-1.5 py-0.5 text-[10px] rounded font-medium", typeColor[step.type] || "bg-zinc-100")}>
                    {step.type}
                  </span>
                  <span className={cn("px-1.5 py-0.5 text-[10px] rounded font-medium", sectionColor[step.section] || "bg-zinc-100")}>
                    {SECTION_META[step.section]?.label}
                  </span>
                  {step.required && (
                    <span className="text-[10px] text-red-400 font-medium">required</span>
                  )}
                </div>
                <p className="text-sm font-medium text-zinc-900 truncate">
                  {step.question}
                </p>
                {step.subtitle && (
                  <p className="text-xs text-zinc-400 truncate">{step.subtitle}</p>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => startEdit(step)}
                  className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteStep(step.id)}
                  className="p-1.5 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add new question */}
      {addingNew ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-rose-300 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-zinc-900">New Question</p>
            <Button size="sm" variant="ghost" onClick={() => setAddingNew(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-500 mb-1 block">ID (unique, snake_case)</label>
            <Input
              value={newStep.id || ""}
              onChange={(e) => setNewStep({ ...newStep, id: e.target.value })}
              placeholder="e.g. core_new_question"
              className="font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-zinc-500 mb-1 block">Type</label>
              <select
                value={newStep.type || "text"}
                onChange={(e) => setNewStep({ ...newStep, type: e.target.value as StepType })}
                className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm"
              >
                {STEP_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-500 mb-1 block">Section</label>
              <select
                value={newStep.section || "core-business"}
                onChange={(e) => setNewStep({ ...newStep, section: e.target.value as Section })}
                className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm"
              >
                {SECTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-500 mb-1 block">Question</label>
            <Input
              value={newStep.question || ""}
              onChange={(e) => setNewStep({ ...newStep, question: e.target.value })}
              placeholder="What do you want to ask?"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-500 mb-1 block">Subtitle</label>
            <Input
              value={newStep.subtitle || ""}
              onChange={(e) => setNewStep({ ...newStep, subtitle: e.target.value })}
              placeholder="Optional helper text"
            />
          </div>

          {(newStep.type === "select" || newStep.type === "multi-select") && (
            <div>
              <label className="text-xs font-medium text-zinc-500 mb-1 block">
                Options (one per line: value | label)
              </label>
              <Textarea
                value={
                  (newStep.options || [])
                    .map((o: StepOption) => `${o.value} | ${o.label}`)
                    .join("\n") || ""
                }
                onChange={(e) => {
                  const options = e.target.value
                    .split("\n")
                    .filter((l) => l.trim())
                    .map((line) => {
                      const [value, ...rest] = line.split("|");
                      return {
                        value: value.trim(),
                        label: rest.join("|").trim() || value.trim(),
                      };
                    });
                  setNewStep({ ...newStep, options });
                }}
                rows={4}
                placeholder="value | Label text"
                className="font-mono text-sm"
              />
            </div>
          )}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={newStep.required ?? false}
              onChange={(e) => setNewStep({ ...newStep, required: e.target.checked })}
              className="rounded"
            />
            Required
          </label>

          <Button
            onClick={addStep}
            disabled={saving || !newStep.id || !newStep.question}
            className="bg-rose-500 hover:bg-rose-600 text-white gap-1"
          >
            <Plus className="w-4 h-4" />
            {saving ? "Adding..." : "Add Question"}
          </Button>
        </div>
      ) : (
        <button
          onClick={() => setAddingNew(true)}
          className="w-full py-3 border-2 border-dashed border-zinc-200 rounded-xl text-zinc-400 hover:text-zinc-600 hover:border-zinc-300 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add question
        </button>
      )}
    </div>
  );
}
