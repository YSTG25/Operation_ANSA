import Link from "next/link";
import { Nav } from "@/components/Nav";
import { GoalCard } from "@/components/GoalCard";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
  const goals = await db.goal.findMany({
    include: {
      entries: {
        orderBy: { date: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl flex-1 px-4 py-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Goals</h1>
            <p className="mt-2 text-zinc-400">
              Manage long-running habits and measurable targets.
            </p>
          </div>
          <Link
            href="/goals/new"
            className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
          >
            New goal
          </Link>
        </div>

        {goals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 p-10 text-center text-zinc-400">
            No goals created yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
