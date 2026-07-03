import Link from "next/link";
import { format } from "date-fns";
import { Nav } from "@/components/Nav";
import { GoalCard } from "@/components/GoalCard";
import { DailyCheckIn } from "@/components/DailyCheckIn";
import { db } from "@/lib/db";
import { getMonthRange, getWeekRange, toDateKey } from "@/lib/dates";
import { calculateCompletionRate, calculateStreak } from "@/lib/stats";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const goals = await db.goal.findMany({
    include: {
      entries: {
        orderBy: { date: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const week = getWeekRange();
  const month = getMonthRange();
  const todayKey = toDateKey(new Date());

  const activeGoals = goals.filter(
    (goal) => !goal.endDate || toDateKey(goal.endDate) >= todayKey,
  );

  const averageWeekRate =
    activeGoals.length === 0
      ? 0
      : Math.round(
          activeGoals.reduce(
            (sum, goal) => sum + calculateCompletionRate(goal, week.start, week.end),
            0,
          ) / activeGoals.length,
        );

  const longestStreak = activeGoals.reduce(
    (max, goal) => Math.max(max, calculateStreak(goal)),
    0,
  );

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl flex-1 px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-zinc-500">{format(new Date(), "EEEE, MMMM d")}</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-50">
              Daily progress dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-zinc-400">
              Track check-ins, streaks, and weekly or monthly completion across your goals.
            </p>
          </div>
          <Link
            href="/goals/new"
            className="inline-flex rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
          >
            Add a goal
          </Link>
        </div>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <p className="text-sm text-zinc-500">Active goals</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-50">{activeGoals.length}</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <p className="text-sm text-zinc-500">Average week completion</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-50">{averageWeekRate}%</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <p className="text-sm text-zinc-500">Longest current streak</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-50">{longestStreak} days</p>
          </div>
        </section>

        {activeGoals.length > 0 ? (
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-medium text-zinc-100">Today&apos;s check-ins</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {activeGoals.slice(0, 4).map((goal) => {
                const todayEntry = goal.entries.find(
                  (entry) => toDateKey(entry.date) === todayKey,
                );

                return (
                  <DailyCheckIn key={goal.id} goal={goal} todayEntry={todayEntry} />
                );
              })}
            </div>
          </section>
        ) : null}

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-zinc-100">Your goals</h2>
            <p className="text-sm text-zinc-500">
              {format(week.start, "MMM d")} – {format(week.end, "MMM d")} ·{" "}
              {format(month.start, "MMMM yyyy")}
            </p>
          </div>

          {goals.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-800 p-10 text-center">
              <p className="text-zinc-400">No goals yet. Create your first one to start tracking.</p>
              <Link
                href="/goals/new"
                className="mt-4 inline-flex rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white"
              >
                Create a goal
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
