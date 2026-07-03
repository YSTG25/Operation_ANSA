"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Goal, DailyEntry } from "@/generated/prisma/client";
import { toDateKey } from "@/lib/dates";

type DailyCheckInProps = {
  goal: Goal;
  todayEntry?: DailyEntry;
};

export function DailyCheckIn({ goal, todayEntry }: DailyCheckInProps) {
  const router = useRouter();
  const today = toDateKey(new Date());
  const [completed, setCompleted] = useState(todayEntry?.completed ?? false);
  const [value, setValue] = useState(
    todayEntry?.value != null ? String(todayEntry.value) : "",
  );
  const [note, setNote] = useState(todayEntry?.note ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function saveEntry() {
    setSaving(true);
    setMessage(null);

    const response = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goalId: goal.id,
        date: today,
        completed: goal.trackingType === "BOOLEAN" ? completed : undefined,
        value:
          goal.trackingType === "NUMERIC" && value !== ""
            ? Number(value)
            : undefined,
        note: note.trim() || undefined,
      }),
    });

    setSaving(false);

    if (!response.ok) {
      setMessage("Could not save check-in.");
      return;
    }

    setMessage("Saved for today.");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-medium text-zinc-50">Today&apos;s check-in</h2>
          <p className="text-sm text-zinc-400">{format(new Date(), "EEEE, MMM d")}</p>
        </div>
        {todayEntry ? (
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
            Logged
          </span>
        ) : null}
      </div>

      {goal.trackingType === "BOOLEAN" ? (
        <label className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3">
          <input
            type="checkbox"
            checked={completed}
            onChange={(event) => setCompleted(event.target.checked)}
            className="h-4 w-4 rounded border-zinc-600 bg-zinc-900"
          />
          <span className="text-sm text-zinc-200">Completed today</span>
        </label>
      ) : (
        <label className="block">
          <span className="mb-2 block text-sm text-zinc-400">
            Progress{goal.unit ? ` (${goal.unit})` : ""}
            {goal.targetValue != null ? ` · target ${goal.targetValue}` : ""}
          </span>
          <input
            type="number"
            min="0"
            step="any"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-zinc-100 outline-none ring-indigo-500 focus:ring-2"
            placeholder="0"
          />
        </label>
      )}

      <label className="mt-4 block">
        <span className="mb-2 block text-sm text-zinc-400">Note (optional)</span>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={3}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-zinc-100 outline-none ring-indigo-500 focus:ring-2"
          placeholder="How did it go?"
        />
      </label>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={saveEntry}
          disabled={saving}
          className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save check-in"}
        </button>
        {message ? <span className="text-sm text-zinc-400">{message}</span> : null}
      </div>
    </div>
  );
}
