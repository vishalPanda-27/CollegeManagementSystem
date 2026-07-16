import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/forms/FormField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { studentApi } from "@/features/student/api/studentApi";
import { subjectApi } from "@/features/subject/api/subjectApi";
import { teacherApi } from "@/features/teacher/api/teacherApi";
import {
  attendanceSchema,
  type AttendanceFormValues,
} from "../schemas/attendanceSchema";
import {
  ATTENDANCE_STATUSES,
  ATTENDANCE_STATUS_LABEL,
  type Attendance,
  type AttendanceRequest,
  type AttendanceStatus,
} from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Attendance | null;
  submitting: boolean;
  onSubmit: (payload: AttendanceRequest) => void;
}

const todayIso = () => new Date().toISOString().slice(0, 10);

export function AttendanceFormDialog({
  open,
  onOpenChange,
  editing,
  submitting,
  onSubmit,
}: Props) {
  const studentsQuery = useQuery({
    queryKey: ["students"],
    queryFn: studentApi.list,
    enabled: open,
  });
  const subjectsQuery = useQuery({
    queryKey: ["subjects"],
    queryFn: subjectApi.list,
    enabled: open,
  });
  const teachersQuery = useQuery({
    queryKey: ["teachers"],
    queryFn: teacherApi.list,
    enabled: open,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      studentId: 0,
      subjectId: 0,
      markedById: null,
      attendanceDate: todayIso(),
      status: "PRESENT",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        studentId: editing?.studentId ?? 0,
        subjectId: editing?.subjectId ?? 0,
        markedById: editing?.markedById ?? null,
        attendanceDate: editing?.attendanceDate ?? todayIso(),
        status: editing?.status ?? "PRESENT",
      });
    }
  }, [open, editing, reset]);

  const studentId = watch("studentId");
  const subjectId = watch("subjectId");
  const markedById = watch("markedById");
  const status = watch("status");

  const students = useMemo(() => studentsQuery.data ?? [], [studentsQuery.data]);
  const subjects = useMemo(() => subjectsQuery.data ?? [], [subjectsQuery.data]);
  const teachers = useMemo(() => teachersQuery.data ?? [], [teachersQuery.data]);

  const submit = (values: AttendanceFormValues) => {
    onSubmit({
      studentId: values.studentId,
      subjectId: values.subjectId,
      markedById: values.markedById ?? null,
      attendanceDate: values.attendanceDate,
      status: values.status as AttendanceStatus,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit attendance" : "Mark attendance"}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? "Update this attendance record."
              : "Record a student's attendance for a subject."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Student</Label>
              <Select
                value={studentId ? String(studentId) : ""}
                onValueChange={(v) =>
                  setValue("studentId", Number(v), {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                disabled={studentsQuery.isLoading}
              >
                <SelectTrigger aria-invalid={!!errors.studentId}>
                  <SelectValue
                    placeholder={
                      studentsQuery.isLoading ? "Loading..." : "Select student"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.firstName} {s.lastName} · {s.rollNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.studentId && (
                <p className="text-xs text-destructive">
                  {errors.studentId.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Select
                value={subjectId ? String(subjectId) : ""}
                onValueChange={(v) =>
                  setValue("subjectId", Number(v), {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                disabled={subjectsQuery.isLoading}
              >
                <SelectTrigger aria-invalid={!!errors.subjectId}>
                  <SelectValue
                    placeholder={
                      subjectsQuery.isLoading ? "Loading..." : "Select subject"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.subjectName} ({s.subjectCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subjectId && (
                <p className="text-xs text-destructive">
                  {errors.subjectId.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Teacher (optional)</Label>
              <Select
                value={markedById ? String(markedById) : "NONE"}
                onValueChange={(v) =>
                  setValue("markedById", v === "NONE" ? null : Number(v), {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                disabled={teachersQuery.isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">— None —</SelectItem>
                  {teachers.map((t) => (
                    <SelectItem key={t.teacherId} value={String(t.teacherId)}>
                      {t.firstName} {t.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <FormField
              label="Attendance date"
              type="date"
              max={todayIso()}
              registration={register("attendanceDate")}
              error={errors.attendanceDate}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) =>
                setValue("status", v as AttendanceStatus, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger aria-invalid={!!errors.status}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {ATTENDANCE_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {ATTENDANCE_STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-xs text-destructive">
                {errors.status.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
