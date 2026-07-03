import { Nav } from "@/components/Nav";
import { GoalForm } from "@/components/GoalForm";

export default function NewGoalPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl flex-1 px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Create a goal</h1>
          <p className="mt-2 text-zinc-400">
            Set a daily habit or numeric target and track it over weeks, months, or years.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <GoalForm />
        </div>
      </main>
    </>
  );
}
