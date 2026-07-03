import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";

export function toDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function parseDateKey(key: string): Date {
  return startOfDay(parseISO(key));
}

export function getWeekRange(reference: Date = new Date()) {
  return {
    start: startOfWeek(reference, { weekStartsOn: 1 }),
    end: endOfWeek(reference, { weekStartsOn: 1 }),
  };
}

export function getMonthRange(reference: Date = new Date()) {
  return {
    start: startOfMonth(reference),
    end: endOfMonth(reference),
  };
}

export function getDaysInRange(start: Date, end: Date): Date[] {
  const today = startOfDay(new Date());
  const cappedEnd = isAfter(end, today) ? today : end;
  if (isAfter(start, cappedEnd)) {
    return [];
  }
  return eachDayOfInterval({ start, end: cappedEnd });
}

export function getRecentDays(count: number): Date[] {
  const today = startOfDay(new Date());
  return eachDayOfInterval({
    start: subDays(today, count - 1),
    end: today,
  });
}

export function isWithinGoalRange(
  date: Date,
  startDate: Date,
  endDate: Date | null,
): boolean {
  const day = startOfDay(date);
  if (isBefore(day, startOfDay(startDate))) {
    return false;
  }
  if (endDate && isAfter(day, startOfDay(endDate))) {
    return false;
  }
  return true;
}
