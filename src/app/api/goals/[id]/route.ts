import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { CreateGoalInput } from "@/lib/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const goal = await db.goal.findUnique({
    where: { id },
    include: {
      entries: {
        orderBy: { date: "desc" },
      },
    },
  });

  if (!goal) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }

  return NextResponse.json(goal);
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json()) as Partial<CreateGoalInput>;

  const existing = await db.goal.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }

  const goal = await db.goal.update({
    where: { id },
    data: {
      title: body.title?.trim(),
      description: body.description?.trim(),
      period: body.period,
      trackingType: body.trackingType,
      targetValue: body.targetValue,
      unit: body.unit?.trim(),
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : body.endDate === null ? null : undefined,
      color: body.color,
    },
    include: { entries: true },
  });

  return NextResponse.json(goal);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  await db.goal.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
