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
import { teacherApi } from "@/features/teacher/api/teacherApi";
import { subjectApi } from "@/features/subject/api/subjectApi";
import { classroomApi } from "@/features/classroom/api/classroomApi";
import {
  classScheduleSchema,
  type ClassScheduleFormValues,
} from "../schemas/classScheduleSchema";
import {
  DAYS_OF_WEEK,
  DAY_LABELS,
  type ClassSchedule,
  type ClassScheduleRequest,
  type DayOfWeek,
} from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: ClassSchedule | null;
  submitting: boolean;
  onSubmit: (payload: ClassScheduleRequest) => void;
}

function toTime(s?: string) {
  if (!s) return "";
  return s.length >= 5 ? s.slice(0, 5) : s;
}

export function ScheduleFormDialog({
  open,
  onOpenChange,
  editing,
  submitting,
  onSubmit,
}: Props) {
  const teachersQuery = useQuery({
    queryKey: ["teachers"],
    queryFn: teacherApi.list,
    enabled: open,
  });
  const subjectsQuery = useQuery({
    queryKey: ["subjects"],
    queryFn: subjectApi.list,
    enabled: open,
  });
  const classroomsQuery = useQuery({
    queryKey: ["classrooms"],
    queryFn: classroomApi.list,
    enabled: open,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ClassScheduleFormValues>({
    resolver: zodResolver(classScheduleSchema),
    defaultValues: {
      teacherId: 0,
      subjectId: 0,
      classroomId: 0,
      dayOfWeek: "MONDAY",
      startTime: "09:00",
      endTime: "10:00",
      semester: "",
      academicYear: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        teacherId: editing?.teacherId ?? 0,
        subjectId: editing?.subjectId ?? 0,
        classroomId: editing?.classroomId ?? 0,
        dayOfWeek: editing?.dayOfWeek ?? "MONDAY",
        startTime: toTime(editing?.startTime) || "09:00",
        endTime: toTime(editing?.endTime) || "10:00",
        semester: editing?.semester ?? "",
        academicYear: editing?.academicYear ?? "",
      });
    }
  }, [open, editing, reset]);

  const teacherId = watch("teacherId");
  const subjectId = watch("subjectId");
  const classroomId = watch("classroomId");
  const dayOfWeek = watch("dayOfWeek");

  const teacherOptions = useMemo(
    () =>
      (teachersQuery.data ?? []).map((t) => ({
        value: t.teacherId,
        label: `${t.firstName} ${t.lastName}`,
        hint: t.email,
      })),
    [teachersQuery.data],
  );
  const subjectOptions = useMemo(
    () =>
      (subjectsQuery.data ?? []).map((s) => ({
        value: s.id,
        label: s.subjectName,
        hint: s.subjectCode,
      })),
    [subjectsQuery.data],
  );
  const classroomOptions = useMemo(
    () =>
      (classroomsQuery.data ?? []).map((c) => ({
        value: c.id,
        label: `${c.roomNumber} — ${c.buildingName}`,
      })),
    [classroomsQuery.data],
  );

  const submit = (values: ClassScheduleFormValues) => {
    onSubmit({
      teacherId: values.teacherId,
      subjectId: values.subjectId,
      classroomId: values.classroomId,
      dayOfWeek: values.dayOfWeek as DayOfWeek,
      startTime:
        values.startTime.length === 5 ? `${values.startTime}:00` : values.startTime,
      endTime:
        values.endTime.length === 5 ? `${values.endTime}:00` : values.endTime,
      semester: values.semester?.trim() || undefined,
      academicYear: values.academicYear?.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit schedule" : "New class schedule"}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? "Update this class schedule entry."
              : "Assign a teacher, subject, and classroom to a weekly time slot."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Teacher</Label>
              <Select
                value={teacherId ? String(teacherId) : ""}
                onValueChange={(v) =>
                  setValue("teacherId", Number(v), {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                disabled={teachersQuery.isLoading}
              >
                <SelectTrigger aria-invalid={!!errors.teacherId}>
                  <SelectValue
                    placeholder={
                      teachersQuery.isLoading ? "Loading..." : "Select teacher"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {teacherOptions.map((t) => (
                    <SelectItem key={t.value} value={String(t.value)}>
                      {t.label}
                      {t.hint ? ` · ${t.hint}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.teacherId && (
                <p className="text-xs text-destructive">
                  {errors.teacherId.message}
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
                  {subjectOptions.map((s) => (
                    <SelectItem key={s.value} value={String(s.value)}>
                      {s.label} ({s.hint})
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
              <Label>Classroom</Label>
              <Select
                value={classroomId ? String(classroomId) : ""}
                onValueChange={(v) =>
                  setValue("classroomId", Number(v), {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                disabled={classroomsQuery.isLoading}
              >
                <SelectTrigger aria-invalid={!!errors.classroomId}>
                  <SelectValue
                    placeholder={
                      classroomsQuery.isLoading
                        ? "Loading..."
                        : "Select classroom"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {classroomOptions.map((c) => (
                    <SelectItem key={c.value} value={String(c.value)}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.classroomId && (
                <p className="text-xs text-destructive">
                  {errors.classroomId.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Day</Label>
              <Select
                value={dayOfWeek}
                onValueChange={(v) =>
                  setValue("dayOfWeek", v as DayOfWeek, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger aria-invalid={!!errors.dayOfWeek}>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((d) => (
                    <SelectItem key={d} value={d}>
                      {DAY_LABELS[d]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.dayOfWeek && (
                <p className="text-xs text-destructive">
                  {errors.dayOfWeek.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Start time"
              type="time"
              registration={register("startTime")}
              error={errors.startTime}
            />
            <FormField
              label="End time"
              type="time"
              registration={register("endTime")}
              error={errors.endTime}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Semester"
              placeholder="e.g. Fall / 3"
              registration={register("semester")}
              error={errors.semester}
            />
            <FormField
              label="Academic year"
              placeholder="e.g. 2025-2026"
              registration={register("academicYear")}
              error={errors.academicYear}
            />
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
              {editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
