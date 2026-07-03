import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Nav } from "@/components/Nav";
import { DailyCheckIn } from "@/components/DailyCheckIn";
import { ProgressChart } from "@/components/ProgressChart";
import { db } from "@/lib/db";
import {
  buildDailyChartData,
  calculateCompletionRate,
  calculateNumericTotal,
  calculateStreak,
} from "@/lib/stats";
import { getDaysInRange, getMonthRange, getRecentDays, getWeekRange, toDateKey } from "@/lib/dates";

export const dynamic = "force-dynamic";

type GoalDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function GoalDetailPage({ params }: GoalDetailPageProps) {
  const { id } = await params;

  const goal = await db.goal.findUnique({
    where: { id },
    include: {
      entries: {
        orderBy: { date: "desc" },
      },
    },
  });

  if (!goal) {
    notFound();
  }

  const week = getWeekRange();
  const month = getMonthRange();
  const recentDays = getRecentDays(30);
  const todayKey = toDateKey(new Date());
  const todayEntry = goal.entries.find((entry) => toDateKey(entry.date) === todayKey);
  const streak = calculateStreak(goal);
  const weekRate = calculateCompletionRate(goal, week.start, week.end);
  const monthRate = calculateCompletionRate(goal, month.start, month.end);
  const monthTotal =
    goal.trackingType === "NUMERIC"
      ? calculateNumericTotal(goal, month.start, month.end)
      : null;
  const weekChart = buildDailyChartData(goal, getDaysInRange(week.start, week.end));
  const monthChart = buildDailyChartData(goal, recentDays);

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl flex-1 px-4 py-8">
        <div className="mb-8">
          <Link href="/goals" className="text-sm text-zinc-500 transition hover:text-zinc-300">
            ← Back to goals
          </Link>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: goal.color }}
                />
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
                  {goal.title}
                </h1>
              </div>
              {goal.description ? (
                <p className="max-w-2xl text-zinc-400">{goal.description}</p>
              ) : null}
              <p className="mt-3 text-sm text-zinc-500">
                {format(goal.startDate, "MMM d, yyyy")}
                {goal.endDate ? ` → ${format(goal.endDate, "MMM d, yyyy")}` : " → ongoing"}
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-5 py-4 text-center">
              <p className="text-sm text-zinc-500">Current streak</p>
              <p className="mt-1 text-3xl font-semibold text-zinc-50">{streak}</p>
            </div>
          </div>
        </div>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <p className="text-sm text-zinc-500">This week</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-50">{weekRate}%</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <p className="text-sm text-zinc-500">This month</p>
            {monthTotal != null ? (
              <p className="mt-2 text-2xl font-semibold text-zinc-50">
                {monthTotal}
                {goal.unit ? ` ${goal.unit}` : ""}
              </p>
            ) : (
              <p className="mt-2 text-2xl font-semibold text-zinc-50">{monthRate}%</p>
            )}
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <p className="text-sm text-zinc-500">Total check-ins</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-50">{goal.entries.length}</p>
          </div>
        </section>

        <div className="mb-8 grid gap-6 lg:grid-cols-[360px_1fr]">
          <DailyCheckIn goal={goal} todayEntry={todayEntry} />
          <div>
            <h2 className="mb-4 text-lg font-medium text-zinc-100">Last 7 days</h2>
            <ProgressChart
              data={weekChart}
              trackingType={goal.trackingType}
              unit={goal.unit}
            />
          </div>
        </div>

        <section>
          <h2 className="mb-4 text-lg font-medium text-zinc-100">Last 30 days</h2>
          <ProgressChart
            data={monthChart}
            trackingType={goal.trackingType}
            unit={goal.unit}
          />
        </section>
      </main>
    </>
  );
}
