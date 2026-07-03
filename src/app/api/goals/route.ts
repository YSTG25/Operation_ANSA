import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { CreateGoalInput } from "@/lib/types";

export async function GET() {
  const goals = await db.goal.findMany({
    include: {
      entries: {
        orderBy: { date: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(goals);
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateGoalInput;

  if (!body.title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (!body.startDate) {
    return NextResponse.json({ error: "Start date is required" }, { status: 400 });
  }

  const goal = await db.goal.create({
    data: {
      title: body.title.trim(),
      description: body.description?.trim() || null,
      period: body.period ?? "CUSTOM",
      trackingType: body.trackingType ?? "BOOLEAN",
      targetValue: body.trackingType === "NUMERIC" ? body.targetValue ?? null : null,
      unit: body.trackingType === "NUMERIC" ? body.unit?.trim() || null : null,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : null,
      color: body.color ?? "#6366f1",
    },
    include: { entries: true },
  });

  return NextResponse.json(goal, { status: 201 });
}
