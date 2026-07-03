import Link from "next/link";
import type { GoalWithEntries } from "@/lib/stats";
import {
  calculateCompletionRate,
  calculateNumericTotal,
  calculateStreak,
} from "@/lib/stats";
import { getMonthRange, getWeekRange, toDateKey } from "@/lib/dates";
import { deleteGoal } from "@/app/actions";

type GoalCardProps = {
  goal: GoalWithEntries;
};

export function GoalCard({ goal }: GoalCardProps) {
  const week = getWeekRange();
  const month = getMonthRange();
  const todayKey = toDateKey(new Date());

  const streak = calculateStreak(goal);
  const weekRate = calculateCompletionRate(goal, week.start, week.end);
  const monthRate = calculateCompletionRate(goal, month.start, month.end);

  const monthTotal =
  goal.trackingType === "NUMERIC"
  ? calculateNumericTotal(goal, month.start, month.end)
  : null;

  // Find today's entry to display on DAILY goals
  const todayEntry = goal.entries.find((e) => toDateKey(e.date) === todayKey);
  const todayStatus = goal.trackingType === "NUMERIC"
  ? `${todayEntry?.value ?? 0}${goal.unit ? ` ${goal.unit}` : ""}`
  : (todayEntry?.completed ? "Done" : "Pending");

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-zinc-700 hover:bg-zinc-900">
    <Link href={`/goals/${goal.id}`} className="group block">
    <div className="mb-4 flex items-start justify-between gap-3">
    <div>
    <div className="mb-2 flex items-center gap-2">
    <span
    className="h-2.5 w-2.5 rounded-full"
    style={{ backgroundColor: goal.color }}
    />
    <h3 className="font-medium text-zinc-50 transition group-hover:text-white">
    {goal.title}
    </h3>
    </div>
    {goal.description ? (
      <p className="line-clamp-2 text-sm text-zinc-400">{goal.description}</p>
    ) : null}
    </div>
    <div className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300">
    {streak} day streak
    </div>
    </div>

    <div className="grid grid-cols-2 gap-3 text-sm">
    {/* Swap "This week" for "Today" if it's a daily goal */}
    {goal.period === "DAILY" ? (
      <div className="rounded-xl bg-zinc-950/70 p-3">
      <p className="text-zinc-500">Today</p>
      <p className="mt-1 text-lg font-semibold text-zinc-100">{todayStatus}</p>
      </div>
    ) : (
      <div className="rounded-xl bg-zinc-950/70 p-3">
      <p className="text-zinc-500">This week</p>
      <p className="mt-1 text-lg font-semibold text-zinc-100">{weekRate}%</p>
      </div>
    )}

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

    <div className="mt-5 flex gap-4 border-t border-zinc-800/50 pt-4">
    <Link
    href={`/goals/${goal.id}/edit`}
    className="text-sm font-medium text-blue-500 transition hover:text-blue-400"
    >
    Edit
    </Link>
    <form action={deleteGoal}>
    <input type="hidden" name="id" value={goal.id} />
    <button
    type="submit"
    className="text-sm font-medium text-red-500 transition hover:text-red-400"
    >
    Delete
    </button>
    </form>
    </div>
    </div>
  );
}
