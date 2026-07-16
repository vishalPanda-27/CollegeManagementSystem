import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
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
import { studentApi } from "@/features/student/api/studentApi";
import { AttendanceStatusBadge } from "../components/AttendanceStatusBadge";
import { useAttendanceByStudent } from "../hooks/useAttendance";

export default function StudentAttendancePage() {
  const [studentId, setStudentId] = useState<string>("");
  const studentsQuery = useQuery({
    queryKey: ["students"],
    queryFn: studentApi.list,
  });
  const query = useAttendanceByStudent(studentId ? Number(studentId) : null);
  const records = query.data ?? [];

  const summary = useMemo(() => {
    const total = records.length;
    const present = records.filter((r) => r.status === "PRESENT").length;
    const pct = total ? Math.round((present / total) * 100) : 0;
    return { total, present, pct };
  }, [records]);

  return (
    <div>
      <PageHeader
        title="Student attendance"
        description="View all attendance records for a selected student."
      />

      <div className="mb-6 grid gap-4 rounded-lg border bg-card p-4 md:grid-cols-3">
        <div className="space-y-1.5 md:col-span-2">
          <Label>Student</Label>
          <Select value={studentId} onValueChange={setStudentId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
              {studentsQuery.data?.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.firstName} {s.lastName} · {s.rollNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {studentId && (
          <div className="flex items-center justify-end gap-6">
            <div>
              <div className="text-xs text-muted-foreground">Total</div>
              <div className="text-2xl font-semibold">{summary.total}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Present %</div>
              <div className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                {summary.pct}%
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg border bg-card">
        {!studentId ? (
          <div className="p-10 text-center text-muted-foreground">
            Select a student to view attendance history.
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
          <div className="p-10 text-center text-muted-foreground">
            No attendance records found for this student.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((r) => (
                <TableRow key={r.attendanceId}>
                  <TableCell>{r.attendanceDate}</TableCell>
                  <TableCell className="font-medium">{r.subjectName}</TableCell>
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
  );
}
