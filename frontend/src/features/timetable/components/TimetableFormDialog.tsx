import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { courseApi } from "@/features/course/api/courseApi";
import { subjectApi } from "@/features/subject/api/subjectApi";
import { teacherApi } from "@/features/teacher/api/teacherApi";
import { classroomApi } from "@/features/classroom/api/classroomApi";
import {
  timetableSchema,
  type TimetableFormValues,
} from "../schemas/timetableSchema";
import {
  DAYS_OF_WEEK,
  DAY_LABELS,
  type DayOfWeek,
  type Timetable,
  type TimetableRequest,
} from "../types";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing?: Timetable | null;
  onSubmit: (values: TimetableRequest) => void;
  submitting?: boolean;
}

function normalizeTime(t?: string) {
  if (!t) return "";
  // "HH:mm:ss" -> "HH:mm" for input[type=time]
  return t.length >= 5 ? t.slice(0, 5) : t;
}

export function TimetableFormDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
  submitting,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TimetableFormValues>({
    resolver: zodResolver(timetableSchema),
    defaultValues: {
      dayOfWeek: "MONDAY",
      startTime: "09:00",
      endTime: "10:00",
      courseId: 0,
      subjectId: 0,
      teacherId: 0,
      classroomId: 0,
    },
  });

  useEffect(() => {
    if (!open) return;
    if (editing) {
      reset({
        dayOfWeek: editing.dayOfWeek,
        startTime: normalizeTime(editing.startTime),
        endTime: normalizeTime(editing.endTime),
        courseId: editing.courseId,
        subjectId: editing.subjectId,
        teacherId: editing.teacherId,
        classroomId: editing.classroomId,
      });
    } else {
      reset({
        dayOfWeek: "MONDAY",
        startTime: "09:00",
        endTime: "10:00",
        courseId: 0,
        subjectId: 0,
        teacherId: 0,
        classroomId: 0,
      });
    }
  }, [open, editing, reset]);

  const courseId = watch("courseId");
  const subjectId = watch("subjectId");

  const coursesQuery = useQuery({
    queryKey: ["courses"],
    queryFn: courseApi.list,
  });
  const subjectsQuery = useQuery({
    queryKey: ["subjects", "course", courseId],
    queryFn: () => subjectApi.listByCourse(courseId),
    enabled: courseId > 0,
  });
  const teachersQuery = useQuery({
    queryKey: ["teachers"],
    queryFn: teacherApi.list,
  });
  const classroomsQuery = useQuery({
    queryKey: ["classrooms"],
    queryFn: classroomApi.list,
  });

  // If selected subject is not in the current subjects list (e.g., course changed), reset it.
  useEffect(() => {
    if (!subjectsQuery.data) return;
    if (subjectId && !subjectsQuery.data.some((s) => s.id === subjectId)) {
      setValue("subjectId", 0, { shouldValidate: false });
    }
  }, [subjectsQuery.data, subjectId, setValue]);

  const teachers = teachersQuery.data ?? [];
  const preferredTeachers = useMemo(() => {
    if (!subjectId) return teachers;
    const preferred = teachers.filter((t) =>
      (t.subjectIds ?? []).includes(subjectId),
    );
    return preferred.length ? preferred : teachers;
  }, [teachers, subjectId]);

  const submit = (values: TimetableFormValues) => {
    onSubmit({
      dayOfWeek: values.dayOfWeek as DayOfWeek,
      startTime: values.startTime.length === 5
        ? `${values.startTime}:00`
        : values.startTime,
      endTime: values.endTime.length === 5
        ? `${values.endTime}:00`
        : values.endTime,
      courseId: values.courseId,
      subjectId: values.subjectId,
      teacherId: values.teacherId,
      classroomId: values.classroomId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit timetable entry" : "Create timetable entry"}
          </DialogTitle>
          <DialogDescription>
            Schedule a class by picking day, time, and the course, subject,
            teacher, and classroom.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Day</Label>
              <Controller
                control={control}
                name="dayOfWeek"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(v) => field.onChange(v)}
                  >
                    <SelectTrigger aria-invalid={!!errors.dayOfWeek}>
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((d) => (
                        <SelectItem key={d} value={d}>
                          {DAY_LABELS[d]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.dayOfWeek && (
                <p className="text-xs text-destructive">
                  {errors.dayOfWeek.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="startTime">Start time</Label>
              <Input
                id="startTime"
                type="time"
                aria-invalid={!!errors.startTime}
                {...register("startTime")}
              />
              {errors.startTime && (
                <p className="text-xs text-destructive">
                  {errors.startTime.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endTime">End time</Label>
              <Input
                id="endTime"
                type="time"
                aria-invalid={!!errors.endTime}
                {...register("endTime")}
              />
              {errors.endTime && (
                <p className="text-xs text-destructive">
                  {errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Course</Label>
            <Controller
              control={control}
              name="courseId"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger aria-invalid={!!errors.courseId}>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {coursesQuery.data?.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.courseCode} — {c.courseName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.courseId && (
              <p className="text-xs text-destructive">
                {errors.courseId.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Subject</Label>
            <Controller
              control={control}
              name="subjectId"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(v) => field.onChange(Number(v))}
                  disabled={!courseId}
                >
                  <SelectTrigger aria-invalid={!!errors.subjectId}>
                    <SelectValue
                      placeholder={
                        courseId ? "Select subject" : "Select a course first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectsQuery.data?.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.subjectCode} — {s.subjectName}
                      </SelectItem>
                    ))}
                    {subjectsQuery.data?.length === 0 && (
                      <div className="px-2 py-1.5 text-xs text-muted-foreground">
                        No subjects for this course
                      </div>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.subjectId && (
              <p className="text-xs text-destructive">
                {errors.subjectId.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Teacher</Label>
              <Controller
                control={control}
                name="teacherId"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <SelectTrigger aria-invalid={!!errors.teacherId}>
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {preferredTeachers.map((t) => {
                        const preferred =
                          !!subjectId &&
                          (t.subjectIds ?? []).includes(subjectId);
                        return (
                          <SelectItem
                            key={t.teacherId}
                            value={String(t.teacherId)}
                          >
                            {t.firstName} {t.lastName}
                            {preferred ? " • assigned" : ""}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.teacherId && (
                <p className="text-xs text-destructive">
                  {errors.teacherId.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Classroom</Label>
              <Controller
                control={control}
                name="classroomId"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <SelectTrigger aria-invalid={!!errors.classroomId}>
                      <SelectValue placeholder="Select classroom" />
                    </SelectTrigger>
                    <SelectContent>
                      {classroomsQuery.data?.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.roomNumber} — {c.buildingName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.classroomId && (
                <p className="text-xs text-destructive">
                  {errors.classroomId.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting
                ? "Saving..."
                : editing
                  ? "Save changes"
                  : "Create entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
