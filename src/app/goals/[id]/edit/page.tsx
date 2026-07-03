import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { EditForm } from "@/components/EditForm"; // Ensure you have this component
import { Nav } from "@/components/Nav";

export default async function EditGoalPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;

    // Fetch the specific goal
    const goal = await db.goal.findUnique({
        where: { id },
    });

    // If the goal doesn't exist, show 404
    if (!goal) {
        notFound();
    }

    return (
        <>
        <Nav />
        <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-zinc-50 mb-6">Edit Goal</h1>
        {/* Pass the fetched goal to your form */}
        <EditForm goal={goal} />
        </main>
        </>
    );
}
