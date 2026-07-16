import { useState } from "react";
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
import { teacherApi } from "@/features/teacher/api/teacherApi";
import { AttendanceStatusBadge } from "../components/AttendanceStatusBadge";
import { useAttendanceByTeacher } from "../hooks/useAttendance";

export default function TeacherAttendancePage() {
  const [teacherId, setTeacherId] = useState<string>("");
  const teachersQuery = useQuery({
    queryKey: ["teachers"],
    queryFn: teacherApi.list,
  });
  const query = useAttendanceByTeacher(teacherId ? Number(teacherId) : null);
  const records = query.data ?? [];

  return (
    <div>
      <PageHeader
        title="Teacher attendance"
        description="Attendance records marked by a selected teacher."
      />

      <div className="mb-6 rounded-lg border bg-card p-4">
        <div className="space-y-1.5 max-w-md">
          <Label>Teacher</Label>
          <Select value={teacherId} onValueChange={setTeacherId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a teacher" />
            </SelectTrigger>
            <SelectContent>
              {teachersQuery.data?.map((t) => (
                <SelectItem key={t.teacherId} value={String(t.teacherId)}>
                  {t.firstName} {t.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        {!teacherId ? (
          <div className="p-10 text-center text-muted-foreground">
            Select a teacher to view attendance records.
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
            No attendance records marked by this teacher.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((r) => (
                <TableRow key={r.attendanceId}>
                  <TableCell>{r.attendanceDate}</TableCell>
                  <TableCell className="font-medium">{r.studentName}</TableCell>
                  <TableCell>{r.subjectName}</TableCell>
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
