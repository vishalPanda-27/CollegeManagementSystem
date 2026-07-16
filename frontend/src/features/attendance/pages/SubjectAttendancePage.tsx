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
import { subjectApi } from "@/features/subject/api/subjectApi";
import { AttendanceStatusBadge } from "../components/AttendanceStatusBadge";
import { useAttendanceBySubject } from "../hooks/useAttendance";

export default function SubjectAttendancePage() {
  const [subjectId, setSubjectId] = useState<string>("");
  const subjectsQuery = useQuery({
    queryKey: ["subjects"],
    queryFn: subjectApi.list,
  });
  const query = useAttendanceBySubject(subjectId ? Number(subjectId) : null);
  const records = query.data ?? [];

  return (
    <div>
      <PageHeader
        title="Subject attendance"
        description="View attendance records for a selected subject."
      />

      <div className="mb-6 rounded-lg border bg-card p-4">
        <div className="space-y-1.5 max-w-md">
          <Label>Subject</Label>
          <Select value={subjectId} onValueChange={setSubjectId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjectsQuery.data?.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.subjectName} ({s.subjectCode})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        {!subjectId ? (
          <div className="p-10 text-center text-muted-foreground">
            Select a subject to view attendance history.
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
            No attendance records found for this subject.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((r) => (
                <TableRow key={r.attendanceId}>
                  <TableCell>{r.attendanceDate}</TableCell>
                  <TableCell className="font-medium">{r.studentName}</TableCell>
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
