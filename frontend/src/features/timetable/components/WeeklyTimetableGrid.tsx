import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { DAYS_OF_WEEK, DAY_SHORT, type Timetable } from "../types";

interface Props {
  timetables: Timetable[];
  onSelect?: (t: Timetable) => void;
  startHour?: number;
  endHour?: number;
}

// Deterministic color palette per subject/course for cards.
const PALETTE = [
  "bg-blue-500/10 border-blue-500/30 text-blue-950 dark:text-blue-100",
  "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100",
  "bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-100",
  "bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-950 dark:text-fuchsia-100",
  "bg-cyan-500/10 border-cyan-500/30 text-cyan-950 dark:text-cyan-100",
  "bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-100",
  "bg-violet-500/10 border-violet-500/30 text-violet-950 dark:text-violet-100",
  "bg-lime-500/10 border-lime-500/30 text-lime-950 dark:text-lime-100",
];

function colorFor(key: string | number): string {
  const s = String(key);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
}

function fmt(t: string): string {
  return t.length >= 5 ? t.slice(0, 5) : t;
}

export function WeeklyTimetableGrid({
  timetables,
  onSelect,
  startHour = 8,
  endHour = 20,
}: Props) {
  const rows = useMemo(() => {
    const arr: { start: number; label: string }[] = [];
    for (let h = startHour; h < endHour; h++) {
      arr.push({
        start: h * 60,
        label: `${String(h).padStart(2, "0")}:00`,
      });
    }
    return arr;
  }, [startHour, endHour]);

  const byDay = useMemo(() => {
    const map = new Map<string, Timetable[]>();
    for (const d of DAYS_OF_WEEK) map.set(d, []);
    for (const t of timetables) map.get(t.dayOfWeek)?.push(t);
    for (const list of map.values()) {
      list.sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
    }
    return map;
  }, [timetables]);

  const slotHeight = 72; // px per hour

  return (
    <div className="rounded-lg border bg-card">
      <div className="overflow-x-auto">
        <div
          className="grid min-w-[900px]"
          style={{
            gridTemplateColumns: `72px repeat(${DAYS_OF_WEEK.length}, minmax(0,1fr))`,
          }}
        >
          {/* Header */}
          <div className="border-b border-r bg-muted/40 p-2 text-xs font-medium text-muted-foreground">
            Time
          </div>
          {DAYS_OF_WEEK.map((d) => (
            <div
              key={d}
              className="border-b bg-muted/40 p-2 text-center text-xs font-semibold uppercase tracking-wide"
            >
              {DAY_SHORT[d]}
            </div>
          ))}

          {/* Time rows (labels) */}
          <div>
            {rows.map((r) => (
              <div
                key={r.label}
                className="border-b border-r px-2 py-1 text-xs text-muted-foreground"
                style={{ height: slotHeight }}
              >
                {r.label}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {DAYS_OF_WEEK.map((d) => {
            const items = byDay.get(d) ?? [];
            return (
              <div
                key={d}
                className="relative border-b"
                style={{ height: rows.length * slotHeight }}
              >
                {/* hour grid lines */}
                {rows.map((r, i) => (
                  <div
                    key={r.label}
                    className={cn(
                      "absolute inset-x-0 border-t border-border/60",
                      i === 0 && "hidden",
                    )}
                    style={{ top: i * slotHeight }}
                  />
                ))}
                {items.map((t) => {
                  const startMin = toMinutes(t.startTime);
                  const endMin = toMinutes(t.endTime);
                  const top =
                    ((startMin - startHour * 60) / 60) * slotHeight;
                  const height = Math.max(
                    28,
                    ((endMin - startMin) / 60) * slotHeight - 4,
                  );
                  const visible =
                    startMin < endHour * 60 && endMin > startHour * 60;
                  if (!visible) return null;
                  return (
                    <button
                      key={t.timetableId}
                      onClick={() => onSelect?.(t)}
                      className={cn(
                        "absolute left-1 right-1 rounded-md border p-1.5 text-left text-[11px] leading-tight shadow-sm transition hover:shadow-md",
                        colorFor(t.subjectId ?? t.courseId),
                      )}
                      style={{
                        top: Math.max(0, top),
                        height,
                      }}
                    >
                      <div className="truncate font-semibold">
                        {t.subjectName ?? `Subject #${t.subjectId}`}
                      </div>
                      <div className="truncate opacity-80">
                        {t.courseName ?? ""}
                      </div>
                      <div className="mt-0.5 truncate opacity-70">
                        {fmt(t.startTime)}–{fmt(t.endTime)}
                      </div>
                      <div className="truncate opacity-70">
                        {t.teacherName ?? ""} · {t.classroomName ?? ""}
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
