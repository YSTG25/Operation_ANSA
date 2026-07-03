import { startOfDay, subDays } from "date-fns";
import type { DailyEntry, Goal, TrackingType } from "@/generated/prisma/client";
import { getDaysInRange, isWithinGoalRange, toDateKey } from "@/lib/dates";

export type GoalWithEntries = Goal & { entries: DailyEntry[] };

export function isEntrySuccessful(
  entry: DailyEntry,
  trackingType: TrackingType,
  targetValue: number | null,
): boolean {
  if (trackingType === "BOOLEAN") {
    return entry.completed;
  }
  if (entry.value == null || targetValue == null) {
    return false;
  }
  return entry.value >= targetValue;
}

export function calculateStreak(
  goal: GoalWithEntries,
  referenceDate: Date = new Date(),
): number {
  const entryMap = new Map(
    goal.entries.map((entry) => [toDateKey(entry.date), entry]),
  );

  let streak = 0;
  let cursor = startOfDay(referenceDate);

  while (isWithinGoalRange(cursor, goal.startDate, goal.endDate)) {
    const entry = entryMap.get(toDateKey(cursor));
    if (!entry || !isEntrySuccessful(entry, goal.trackingType, goal.targetValue)) {
      break;
    }
    streak += 1;
    cursor = subDays(cursor, 1);
  }

  return streak;
}

export function calculateCompletionRate(
  goal: GoalWithEntries,
  start: Date,
  end: Date,
): number {
  const days = getDaysInRange(start, end).filter((day) =>
    isWithinGoalRange(day, goal.startDate, goal.endDate),
  );

  if (days.length === 0) {
    return 0;
  }

  const entryMap = new Map(
    goal.entries.map((entry) => [toDateKey(entry.date), entry]),
  );

  const successfulDays = days.filter((day) => {
    const entry = entryMap.get(toDateKey(day));
    return (
      entry != null &&
      isEntrySuccessful(entry, goal.trackingType, goal.targetValue)
    );
  }).length;

  return Math.round((successfulDays / days.length) * 100);
}

export function calculateNumericTotal(
  goal: GoalWithEntries,
  start: Date,
  end: Date,
): number {
  const startKey = toDateKey(start);
  const endKey = toDateKey(end);

  return goal.entries.reduce((total, entry) => {
    const key = toDateKey(entry.date);
    if (key < startKey || key > endKey || entry.value == null) {
      return total;
    }
    return total + entry.value;
  }, 0);
}

export function buildDailyChartData(
  goal: GoalWithEntries,
  days: Date[],
): Array<{ date: string; label: string; value: number; success: number }> {
  const entryMap = new Map(
    goal.entries.map((entry) => [toDateKey(entry.date), entry]),
  );

  return days
    .filter((day) => isWithinGoalRange(day, goal.startDate, goal.endDate))
    .map((day) => {
      const key = toDateKey(day);
      const entry = entryMap.get(key);

      if (goal.trackingType === "NUMERIC") {
        return {
          date: key,
          label: key.slice(5),
          value: entry?.value ?? 0,
          success: entry && goal.targetValue != null && entry.value != null && entry.value >= goal.targetValue ? 1 : 0,
        };
      }

      return {
        date: key,
        label: key.slice(5),
        value: entry?.completed ? 1 : 0,
        success: entry?.completed ? 1 : 0,
      };
    });
}
