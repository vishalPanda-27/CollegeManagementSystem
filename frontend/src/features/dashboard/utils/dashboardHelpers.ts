import type { Attendance } from "@/features/attendance/types";
import type { Timetable, DayOfWeek } from "@/features/timetable/types";

export const dayOfWeekFromDate = (d: Date): DayOfWeek => {
  const map: DayOfWeek[] = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  return map[d.getDay()];
};

export const todayIso = () => new Date().toISOString().slice(0, 10);

export const attendancePercentage = (records: Attendance[]) => {
  if (!records.length) return 0;
  const present = records.filter(
    (r) => r.status === "PRESENT" || r.status === "LATE",
  ).length;
  return (present / records.length) * 100;
};

export const sortByTime = (a: Timetable, b: Timetable) =>
  a.startTime.localeCompare(b.startTime);

export const formatTime = (t?: string | null) => {
  if (!t) return "—";
  const [h, m] = t.split(":");
  return `${h}:${m}`;
};

export const initials = (name?: string | null) => {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
};
