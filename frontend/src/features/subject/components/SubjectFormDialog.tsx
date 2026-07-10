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
import { FormField } from "@/components/forms/FormField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { departmentsApi } from "@/api/departments";
import { courseApi } from "@/features/course/api/courseApi";
import { subjectSchema, type SubjectFormValues } from "../schemas/subjectSchema";
import type { Subject, SubjectRequest } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Subject | null;
  submitting: boolean;
  onSubmit: (payload: SubjectRequest) => void;
}

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export function SubjectFormDialog({
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
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      subjectName: "",
      subjectCode: "",
      credits: 3,
      theoryHours: 3,
      practicalHours: 0,
      semester: 1,
      active: true,
      departmentId: 0,
      courseId: 0,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        subjectName: editing?.subjectName ?? "",
        subjectCode: editing?.subjectCode ?? "",
        credits: editing?.credits ?? 3,
        theoryHours: editing?.theoryHours ?? 3,
        practicalHours: editing?.practicalHours ?? 0,
        semester: editing?.semester ?? 1,
        active: editing?.active ?? true,
        departmentId: editing?.departmentId ?? 0,
        courseId: editing?.courseId ?? 0,
      });
    }
  }, [open, editing, reset]);

  const departmentId = watch("departmentId");
  const courseId = watch("courseId");
  const semester = watch("semester");

  const coursesQuery = useQuery({
    queryKey: ["courses", "byDepartment", departmentId],
    queryFn: () => courseApi.listByDepartment(departmentId),
    enabled: open && !!departmentId,
  });

  const submit = (values: SubjectFormValues) => {
    onSubmit({
      subjectName: values.subjectName.trim(),
      subjectCode: values.subjectCode.trim(),
      credits: values.credits,
      theoryHours: values.theoryHours,
      practicalHours: values.practicalHours ?? 0,
      semester: values.semester,
      active: values.active,
      departmentId: values.departmentId,
      courseId: values.courseId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit subject" : "New subject"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Update the details for this subject."
              : "Create a new subject under a course."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <FormField
            label="Subject name"
            placeholder="Discrete Mathematics"
            registration={register("subjectName")}
            error={errors.subjectName}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Subject code"
              placeholder="MA201"
              registration={register("subjectCode")}
              error={errors.subjectCode}
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

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              label="Theory hours"
              type="number"
              min={1}
              registration={register("theoryHours", { valueAsNumber: true })}
              error={errors.theoryHours}
            />
            <FormField
              label="Practical hours"
              type="number"
              min={0}
              registration={register("practicalHours", { valueAsNumber: true })}
              error={errors.practicalHours}
            />
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
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTERS.map((s) => (
                    <SelectItem key={s} value={String(s)}>
                      Sem {s}
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Department</Label>
              <Select
                value={departmentId ? String(departmentId) : ""}
                onValueChange={(v) => {
                  setValue("departmentId", Number(v), {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  setValue("courseId", 0, { shouldValidate: false });
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
            <div className="space-y-1.5">
              <Label>Course</Label>
              <Select
                value={courseId ? String(courseId) : ""}
                onValueChange={(v) =>
                  setValue("courseId", Number(v), {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                disabled={!departmentId || coursesQuery.isLoading}
              >
                <SelectTrigger aria-invalid={!!errors.courseId}>
                  <SelectValue
                    placeholder={
                      !departmentId
                        ? "Select a department first"
                        : coursesQuery.isLoading
                          ? "Loading courses..."
                          : "Select course"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {coursesQuery.data?.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.courseName} ({c.courseCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.courseId && (
                <p className="text-xs text-destructive">
                  {errors.courseId.message}
                </p>
              )}
            </div>
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
