import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ErrorState } from "@/components/common/ErrorState";
import { ScheduleViewDrawer } from "../components/ScheduleViewDrawer";
import { useSchedulesByDay } from "../hooks/useClassSchedules";
import {
  DAYS_OF_WEEK,
  DAY_LABELS,
  type ClassSchedule,
  type DayOfWeek,
} from "../types";

function fmtTime(t?: string) {
  if (!t) return "—";
  return t.length >= 5 ? t.slice(0, 5) : t;
}

const JS_DAY_TO_ENUM: Record<number, DayOfWeek> = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

export default function DailySchedulePage() {
  const [day, setDay] = useState<DayOfWeek>(JS_DAY_TO_ENUM[new Date().getDay()]);
  const [viewing, setViewing] = useState<ClassSchedule | null>(null);
  const scheduleQuery = useSchedulesByDay(day);
  const schedules = (scheduleQuery.data ?? [])
    .slice()
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div>
      <PageHeader
        title="Daily schedule"
        description="Browse every class scheduled for a specific day of the week."
        actions={
          <Select value={day} onValueChange={(v) => setDay(v as DayOfWeek)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAYS_OF_WEEK.map((d) => (
                <SelectItem key={d} value={d}>
                  {DAY_LABELS[d]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarDays className="h-4 w-4" />
        <span>{DAY_LABELS[day]}</span>
        <Badge variant="secondary">{schedules.length} classes</Badge>
      </div>

      {scheduleQuery.isLoading ? (
        <Skeleton className="h-[400px] w-full" />
      ) : scheduleQuery.isError ? (
        <ErrorState onRetry={() => scheduleQuery.refetch()} />
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Classroom</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Year</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-16 text-center text-sm text-muted-foreground"
                  >
                    No classes scheduled for {DAY_LABELS[day]}.
                  </TableCell>
                </TableRow>
              ) : (
                schedules.map((s) => (
                  <TableRow
                    key={s.scheduleId}
                    className="cursor-pointer"
                    onClick={() => setViewing(s)}
                  >
                    <TableCell className="font-mono text-xs">
                      {fmtTime(s.startTime)}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {fmtTime(s.endTime)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {s.subjectName ?? `#${s.subjectId}`}
                    </TableCell>
                    <TableCell>{s.teacherName ?? `#${s.teacherId}`}</TableCell>
                    <TableCell>
                      {s.classroomName ?? `#${s.classroomId}`}
                    </TableCell>
                    <TableCell>{s.semester ?? "—"}</TableCell>
                    <TableCell>{s.academicYear ?? "—"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <ScheduleViewDrawer
        open={!!viewing}
        onOpenChange={(v) => !v && setViewing(null)}
        schedule={viewing}
      />
    </div>
  );
}
