"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { GoalPeriod, TrackingType } from "@/generated/prisma/client";
import { GOAL_COLORS, GOAL_PERIODS, TRACKING_TYPES } from "@/lib/types";

export function GoalForm() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [period, setPeriod] = useState<GoalPeriod>("MONTHLY");
  const [trackingType, setTrackingType] = useState<TrackingType>("BOOLEAN");
  const [targetValue, setTargetValue] = useState("");
  const [unit, setUnit] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");
  const [color, setColor] = useState(GOAL_COLORS[0]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const response = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        period,
        trackingType,
        targetValue: targetValue ? Number(targetValue) : undefined,
        unit,
        startDate,
        endDate: endDate || undefined,
        color,
      }),
    });

    setSubmitting(false);

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Could not create goal.");
      return;
    }

    const goal = (await response.json()) as { id: string };
    router.push(`/goals/${goal.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm text-zinc-400">Title</span>
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-zinc-100 outline-none ring-indigo-500 focus:ring-2"
            placeholder="Read 30 minutes daily"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm text-zinc-400">Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-zinc-100 outline-none ring-indigo-500 focus:ring-2"
            placeholder="Why this goal matters"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-zinc-400">Time horizon</span>
          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value as GoalPeriod)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-zinc-100 outline-none ring-indigo-500 focus:ring-2"
          >
            {GOAL_PERIODS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-zinc-400">Tracking type</span>
          <select
            value={trackingType}
            onChange={(event) => setTrackingType(event.target.value as TrackingType)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-zinc-100 outline-none ring-indigo-500 focus:ring-2"
          >
            {TRACKING_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {trackingType === "NUMERIC" ? (
          <>
            <label className="block">
              <span className="mb-2 block text-sm text-zinc-400">Daily target</span>
              <input
                type="number"
                min="0"
                step="any"
                value={targetValue}
                onChange={(event) => setTargetValue(event.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-zinc-100 outline-none ring-indigo-500 focus:ring-2"
                placeholder="30"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-zinc-400">Unit</span>
              <input
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-zinc-100 outline-none ring-indigo-500 focus:ring-2"
                placeholder="minutes"
              />
            </label>
          </>
        ) : null}

        <label className="block">
          <span className="mb-2 block text-sm text-zinc-400">Start date</span>
          <input
            type="date"
            required
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-zinc-100 outline-none ring-indigo-500 focus:ring-2"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-zinc-400">End date (optional)</span>
          <input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-zinc-100 outline-none ring-indigo-500 focus:ring-2"
          />
        </label>
      </div>

      <div>
        <span className="mb-3 block text-sm text-zinc-400">Color</span>
        <div className="flex flex-wrap gap-3">
          {GOAL_COLORS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setColor(option)}
              className={`h-9 w-9 rounded-full border-2 ${
                color === option ? "border-white" : "border-transparent"
              }`}
              style={{ backgroundColor: option }}
              aria-label={`Choose color ${option}`}
            />
          ))}
        </div>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:opacity-60"
      >
        {submitting ? "Creating..." : "Create goal"}
      </button>
    </form>
  );
}
