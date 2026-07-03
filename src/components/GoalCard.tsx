import Link from "next/link";
import type { GoalWithEntries } from "@/lib/stats";
import {
  calculateCompletionRate,
  calculateNumericTotal,
  calculateStreak,
} from "@/lib/stats";
import { getMonthRange, getWeekRange } from "@/lib/dates";

type GoalCardProps = {
  goal: GoalWithEntries;
};

export function GoalCard({ goal }: GoalCardProps) {
  const week = getWeekRange();
  const month = getMonthRange();
  const streak = calculateStreak(goal);
  const weekRate = calculateCompletionRate(goal, week.start, week.end);
  const monthRate = calculateCompletionRate(goal, month.start, month.end);
  const monthTotal =
    goal.trackingType === "NUMERIC"
      ? calculateNumericTotal(goal, month.start, month.end)
      : null;

  return (
    <Link
      href={`/goals/${goal.id}`}
      className="group block rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-zinc-700 hover:bg-zinc-900"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: goal.color }}
            />
            <h3 className="font-medium text-zinc-50 group-hover:text-white">
              {goal.title}
            </h3>
          </div>
          {goal.description ? (
            <p className="text-sm text-zinc-400 line-clamp-2">{goal.description}</p>
          ) : null}
        </div>
        <div className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300">
          {streak} day streak
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-zinc-950/70 p-3">
          <p className="text-zinc-500">This week</p>
          <p className="mt-1 text-lg font-semibold text-zinc-100">{weekRate}%</p>
        </div>
        <div className="rounded-xl bg-zinc-950/70 p-3">
          <p className="text-zinc-500">This month</p>
          {monthTotal != null ? (
            <p className="mt-1 text-lg font-semibold text-zinc-100">
              {monthTotal}
              {goal.unit ? ` ${goal.unit}` : ""}
            </p>
          ) : (
            <p className="mt-1 text-lg font-semibold text-zinc-100">{monthRate}%</p>
          )}
        </div>
      </div>
    </Link>
  );
}
