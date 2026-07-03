import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { UpsertEntryInput } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as UpsertEntryInput;

  if (!body.goalId || !body.date) {
    return NextResponse.json(
      { error: "goalId and date are required" },
      { status: 400 },
    );
  }

  const goal = await db.goal.findUnique({ where: { id: body.goalId } });
  if (!goal) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }

  const entry = await db.dailyEntry.upsert({
    where: {
      goalId_date: {
        goalId: body.goalId,
        date: new Date(body.date),
      },
    },
    create: {
      goalId: body.goalId,
      date: new Date(body.date),
      completed: body.completed ?? false,
      value: body.value ?? null,
      note: body.note?.trim() || null,
    },
    update: {
      completed: body.completed ?? false,
      value: body.value ?? null,
      note: body.note?.trim() || null,
    },
  });

  return NextResponse.json(entry);
}
