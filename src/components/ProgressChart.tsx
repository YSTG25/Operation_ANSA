"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartPoint = {
  date: string;
  label: string;
  value: number;
  success: number;
};

type ProgressChartProps = {
  data: ChartPoint[];
  trackingType: "BOOLEAN" | "NUMERIC";
  unit?: string | null;
};

export function ProgressChart({ data, trackingType, unit }: ProgressChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-zinc-800 text-sm text-zinc-500">
        No activity in this range yet.
      </div>
    );
  }

  return (
    <div className="h-72 w-full rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="label" stroke="#71717a" fontSize={12} />
          <YAxis
            stroke="#71717a"
            fontSize={12}
            allowDecimals={trackingType === "NUMERIC"}
            domain={trackingType === "BOOLEAN" ? [0, 1] : [0, "auto"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: "12px",
            }}
            labelStyle={{ color: "#fafafa" }}
            formatter={(value) => [
              trackingType === "BOOLEAN"
                ? Number(value) === 1
                  ? "Done"
                  : "Not done"
                : `${value}${unit ? ` ${unit}` : ""}`,
              trackingType === "BOOLEAN" ? "Status" : "Value",
            ]}
          />
          <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
