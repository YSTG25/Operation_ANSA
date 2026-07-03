import { updateGoal } from "@/app/actions";

// Define the interface manually to bypass the Prisma import issues
export interface Goal {
    id: string;
    title: string;
    description: string | null;
    // If you use other fields in your form, add them here:
    // color: string;
    // startDate: Date | string;
}

export function EditForm({ goal }: { goal: Goal }) {
    return (
        <form action={updateGoal} className="space-y-4">
        <input type="hidden" name="id" value={goal.id} />

        <div>
        <label className="block text-sm text-zinc-400">Title</label>
        <input
        name="title"
        defaultValue={goal.title ?? ""}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-zinc-50"
        />
        </div>

        <button
        type="submit"
        className="rounded-xl bg-indigo-500 px-4 py-2 text-white"
        >
        Save Changes
        </button>
        </form>
    );
}
