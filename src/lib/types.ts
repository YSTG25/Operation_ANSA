import { GoalPeriod, TrackingType } from "@/generated/prisma/client";

export const GOAL_PERIODS: { value: GoalPeriod; label: string }[] = [
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" },
  { value: "CUSTOM", label: "Custom range" },
];

export const TRACKING_TYPES: { value: TrackingType; label: string }[] = [
  { value: "BOOLEAN", label: "Yes / No check-in" },
  { value: "NUMERIC", label: "Numeric progress" },
];

export const GOAL_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#0ea5e9",
];

export type CreateGoalInput = {
  title: string;
  description?: string;
  period: GoalPeriod;
  trackingType: TrackingType;
  targetValue?: number;
  unit?: string;
  startDate: string;
  endDate?: string;
  color?: string;
};

export type UpsertEntryInput = {
  goalId: string;
  date: string;
  completed?: boolean;
  value?: number;
  note?: string;
};
