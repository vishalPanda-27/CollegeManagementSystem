import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { subjectApi } from "@/features/subject/api/subjectApi";
import { teacherApi } from "@/features/teacher/api/teacherApi";
import { enrollmentApi } from "@/features/enrollment/api/enrollmentApi";
import { attendanceApi } from "../api/attendanceApi";
import {
  ATTENDANCE_STATUSES,
  ATTENDANCE_STATUS_LABEL,
  type AttendanceStatus,
} from "../types";

const todayIso = () => new Date().toISOString().slice(0, 10);

const STATUS_TONE: Record<AttendanceStatus, string> = {
  PRESENT: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  ABSENT: "bg-red-500/10 text-red-700 dark:text-red-400",
  LATE: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  LEAVE: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
};

export default function BulkAttendancePage() {
  const qc = useQueryClient();

  const [subjectId, setSubjectId] = useState<string>("");
  const [teacherId, setTeacherId] = useState<string>("NONE");
  const [date, setDate] = useState<string>(todayIso());
  const [statuses, setStatuses] = useState<Record<number, AttendanceStatus>>({});
  const [saving, setSaving] = useState(false);

  const subjectsQuery = useQuery({
    queryKey: ["subjects"],
    queryFn: subjectApi.list,
  });
  const teachersQuery = useQuery({
    queryKey: ["teachers"],
    queryFn: teacherApi.list,
  });

  const selectedSubject = useMemo(
    () =>
      subjectsQuery.data?.find((s) => String(s.id) === subjectId) ?? null,
    [subjectsQuery.data, subjectId],
  );

  const courseId = selectedSubject?.courseId ?? null;

  const enrollmentsQuery = useQuery({
    queryKey: ["enrollments", "course", courseId],
    queryFn: () => enrollmentApi.listByCourse(courseId as number),
    enabled: courseId != null,
  });

  const students = useMemo(() => {
    const rows = (enrollmentsQuery.data ?? []).filter(
      (e) => e.status === "ENROLLED",
    );
    const seen = new Set<number>();
    const out: { studentId: number; studentName: string }[] = [];
    for (const e of rows) {
      if (seen.has(e.studentId)) continue;
      seen.add(e.studentId);
      out.push({ studentId: e.studentId, studentName: e.studentName });
    }
    return out;
  }, [enrollmentsQuery.data]);

  useEffect(() => {
    setStatuses((prev) => {
      const next: Record<number, AttendanceStatus> = {};
      for (const s of students) {
        next[s.studentId] = prev[s.studentId] ?? "PRESENT";
      }
      return next;
    });
  }, [students]);

  const setAll = (status: AttendanceStatus) => {
    setStatuses(() => {
      const next: Record<number, AttendanceStatus> = {};
      for (const s of students) next[s.studentId] = status;
      return next;
    });
  };

  const counts = useMemo(() => {
    const c = { PRESENT: 0, ABSENT: 0, LATE: 0, LEAVE: 0 } as Record<
      AttendanceStatus,
      number
    >;
    for (const s of students) c[statuses[s.studentId] ?? "PRESENT"]++;
    return c;
  }, [students, statuses]);

  const canSave =
    !!subjectId && !!date && students.length > 0 && date <= todayIso();

  const handleSave = async () => {
    if (!canSave || !selectedSubject) return;
    setSaving(true);
    let ok = 0;
    let failed = 0;
    const errors: string[] = [];
    for (const s of students) {
      const status = statuses[s.studentId] ?? "PRESENT";
      try {
        await attendanceApi.create({
          studentId: s.studentId,
          subjectId: selectedSubject.id,
          markedById: teacherId === "NONE" ? null : Number(teacherId),
          attendanceDate: date,
          status,
        });
        ok++;
      } catch (e) {
        failed++;
        const msg =
          (e as { response?: { data?: { message?: string } } })?.response?.data
            ?.message ?? "Failed";
        errors.push(`${s.studentName}: ${msg}`);
      }
    }
    setSaving(false);
    qc.invalidateQueries({ queryKey: ["attendance"] });
    if (ok > 0) toast.success(`Saved ${ok} attendance record${ok === 1 ? "" : "s"}`);
    if (failed > 0)
      toast.error(
        `${failed} failed. ${errors.slice(0, 2).join("; ")}${
          errors.length > 2 ? "…" : ""
        }`,
      );
  };

  return (
    <div>
      <PageHeader
        title="Bulk attendance"
        description="Mark attendance for all students enrolled in a subject."
      />

      <div className="mb-6 grid gap-4 rounded-lg border bg-card p-4 md:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Subject</Label>
          <Select value={subjectId} onValueChange={setSubjectId}>
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
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
        <div className="space-y-1.5">
          <Label>Date</Label>
          <Input
            type="date"
            value={date}
            max={todayIso()}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Marked by (teacher)</Label>
          <Select value={teacherId} onValueChange={setTeacherId}>
            <SelectTrigger>
              <SelectValue placeholder="Select teacher" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NONE">— None —</SelectItem>
              {teachersQuery.data?.map((t) => (
                <SelectItem key={t.teacherId} value={String(t.teacherId)}>
                  {t.firstName} {t.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {subjectId && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {ATTENDANCE_STATUSES.map((s) => (
              <Button
                key={s}
                variant="outline"
                size="sm"
                onClick={() => setAll(s)}
                disabled={students.length === 0}
              >
                Mark all {ATTENDANCE_STATUS_LABEL[s]}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {ATTENDANCE_STATUSES.map((s) => (
              <span
                key={s}
                className={`rounded-md px-2 py-1 ${STATUS_TONE[s]}`}
              >
                {ATTENDANCE_STATUS_LABEL[s]}: {counts[s]}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg border bg-card">
        {!subjectId ? (
          <div className="p-10 text-center text-muted-foreground">
            <Users className="mx-auto mb-2 h-8 w-8 opacity-60" />
            Select a subject to load enrolled students.
          </div>
        ) : enrollmentsQuery.isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : enrollmentsQuery.isError ? (
          <div className="p-6 text-center text-destructive">
            Failed to load enrolled students.
          </div>
        ) : students.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            No students enrolled in this subject's course.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">#</TableHead>
                <TableHead>Student</TableHead>
                <TableHead className="w-[380px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s, idx) => {
                const current = statuses[s.studentId] ?? "PRESENT";
                return (
                  <TableRow key={s.studentId}>
                    <TableCell className="text-muted-foreground">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {s.studentName}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {ATTENDANCE_STATUSES.map((st) => (
                          <Button
                            key={st}
                            type="button"
                            size="sm"
                            variant={current === st ? "default" : "outline"}
                            onClick={() =>
                              setStatuses((p) => ({
                                ...p,
                                [s.studentId]: st,
                              }))
                            }
                            className={
                              current === st ? "" : STATUS_TONE[st]
                            }
                          >
                            {ATTENDANCE_STATUS_LABEL[st]}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {subjectId && students.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSave} disabled={!canSave || saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save attendance
          </Button>
        </div>
      )}
    </div>
  );
}
