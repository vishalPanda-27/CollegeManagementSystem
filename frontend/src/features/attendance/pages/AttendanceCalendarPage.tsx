import { useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { PageHeader } from "@/components/common/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ErrorState } from "@/components/common/ErrorState";
import { AttendanceStatusBadge } from "../components/AttendanceStatusBadge";
import { useAttendanceByDate } from "../hooks/useAttendance";

function toIso(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function AttendanceCalendarPage() {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const iso = useMemo(() => (selected ? toIso(selected) : ""), [selected]);
  const query = useAttendanceByDate(iso || null);

  const records = query.data ?? [];
  const summary = useMemo(() => {
    let present = 0, absent = 0, late = 0, leave = 0;
    for (const r of records) {
      if (r.status === "PRESENT") present++;
      else if (r.status === "ABSENT") absent++;
      else if (r.status === "LATE") late++;
      else if (r.status === "LEAVE") leave++;
    }
    return { present, absent, late, leave };
  }, [records]);

  return (
    <div>
      <PageHeader
        title="Attendance calendar"
        description="Select a date to view attendance records for that day."
      />
      <div className="grid gap-6 lg:grid-cols-[auto,1fr]">
        <div className="rounded-lg border bg-card p-3">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={setSelected}
            className="rounded-md"
          />
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              Present: <span className="font-semibold">{summary.present}</span>
            </div>
            <div className="rounded-md bg-red-500/10 p-2 text-red-600 dark:text-red-400">
              Absent: <span className="font-semibold">{summary.absent}</span>
            </div>
            <div className="rounded-md bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
              Late: <span className="font-semibold">{summary.late}</span>
            </div>
            <div className="rounded-md bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
              Leave: <span className="font-semibold">{summary.leave}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="border-b p-4">
            <div className="text-sm text-muted-foreground">Records for</div>
            <div className="text-lg font-semibold">{iso || "—"}</div>
          </div>
          {!iso ? (
            <div className="p-8 text-center text-muted-foreground">
              Pick a date to view records.
            </div>
          ) : query.isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : query.isError ? (
            <div className="p-6">
              <ErrorState onRetry={() => query.refetch()} />
            </div>
          ) : records.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No attendance records for this date.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((r) => (
                  <TableRow key={r.attendanceId}>
                    <TableCell className="font-medium">{r.studentName}</TableCell>
                    <TableCell>{r.subjectName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.teacherName ?? "—"}
                    </TableCell>
                    <TableCell>
                      <AttendanceStatusBadge status={r.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
