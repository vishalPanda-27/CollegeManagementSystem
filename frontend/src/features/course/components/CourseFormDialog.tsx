import { useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/forms/FormField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { departmentsApi } from "@/api/departments";
import { programApi } from "@/features/program/api/programApi";
import { courseSchema, type CourseFormValues } from "../schemas/courseSchema";
import type { Course, CourseRequest } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Course | null;
  submitting: boolean;
  onSubmit: (payload: CourseRequest) => void;
}

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export function CourseFormDialog({
  open,
  onOpenChange,
  editing,
  submitting,
  onSubmit,
}: Props) {
  const departmentsQuery = useQuery({
    queryKey: ["departments"],
    queryFn: departmentsApi.list,
    enabled: open,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseName: "",
      courseCode: "",
      credits: 3,
      semester: 1,
      description: "",
      departmentId: 0,
      programId: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        courseName: editing?.courseName ?? "",
        courseCode: editing?.courseCode ?? "",
        credits: editing?.credits ?? 3,
        semester: editing?.semester ?? 1,
        description: editing?.description ?? "",
        departmentId: editing?.departmentId ?? 0,
        programId: undefined,
      });
    }
  }, [open, editing, reset]);

  const departmentId = watch("departmentId");
  const semester = watch("semester");
  const programId = watch("programId");

  const programsQuery = useQuery({
    queryKey: ["programs", "byDepartment", departmentId],
    queryFn: () => programApi.listByDepartment(departmentId),
    enabled: open && !!departmentId,
  });

  const submit = (values: CourseFormValues) => {
    onSubmit({
      courseName: values.courseName.trim(),
      courseCode: values.courseCode.trim(),
      credits: values.credits,
      semester: values.semester,
      description: values.description?.trim() || undefined,
      departmentId: values.departmentId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit course" : "New course"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Update the details for this course."
              : "Create a new course under a department."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <FormField
            label="Course name"
            placeholder="Data Structures"
            registration={register("courseName")}
            error={errors.courseName}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Course code"
              placeholder="CS201"
              registration={register("courseCode")}
              error={errors.courseCode}
            />
            <FormField
              label="Credits"
              type="number"
              min={2}
              max={10}
              registration={register("credits", { valueAsNumber: true })}
              error={errors.credits}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Semester</Label>
              <Select
                value={semester ? String(semester) : ""}
                onValueChange={(v) =>
                  setValue("semester", Number(v), {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger aria-invalid={!!errors.semester}>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTERS.map((s) => (
                    <SelectItem key={s} value={String(s)}>
                      Semester {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.semester && (
                <p className="text-xs text-destructive">
                  {errors.semester.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Department</Label>
              <Select
                value={departmentId ? String(departmentId) : ""}
                onValueChange={(v) => {
                  setValue("departmentId", Number(v), {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  setValue("programId", undefined);
                }}
                disabled={departmentsQuery.isLoading}
              >
                <SelectTrigger aria-invalid={!!errors.departmentId}>
                  <SelectValue
                    placeholder={
                      departmentsQuery.isLoading
                        ? "Loading..."
                        : "Select department"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {departmentsQuery.data?.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.name} ({d.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.departmentId && (
                <p className="text-xs text-destructive">
                  {errors.departmentId.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Program (optional)</Label>
            <Select
              value={programId ? String(programId) : ""}
              onValueChange={(v) =>
                setValue("programId", v ? Number(v) : undefined)
              }
              disabled={!departmentId || programsQuery.isLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !departmentId
                      ? "Select a department first"
                      : programsQuery.isLoading
                        ? "Loading programs..."
                        : "Select program"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {programsQuery.data?.map((p) => (
                  <SelectItem key={p.programId} value={String(p.programId)}>
                    {p.programName} ({p.programCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Short description..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
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
              {editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
