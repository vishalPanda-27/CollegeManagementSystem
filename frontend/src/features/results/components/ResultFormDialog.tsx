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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { studentApi } from "@/features/student/api/studentApi";
import { subjectApi } from "@/features/subject/api/subjectApi";
import { resultSchema, type ResultFormValues } from "../schemas/resultSchema";
import type { Result, ResultRequest } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Result | null;
  submitting: boolean;
  onSubmit: (payload: ResultRequest) => void;
}

export function ResultFormDialog({
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

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ResultFormValues>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      studentId: 0,
      subjectId: 0,
      marksObtained: 0,
      maximumMarks: 100,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        studentId: editing?.studentId ?? 0,
        subjectId: editing?.subjectId ?? 0,
        marksObtained: editing?.marksObtained ?? 0,
        maximumMarks: editing?.maximumMarks ?? 100,
      });
    }
  }, [open, editing, reset]);

  const studentId = watch("studentId");
  const subjectId = watch("subjectId");
  const marksObtained = watch("marksObtained");
  const maximumMarks = watch("maximumMarks");

  const students = useMemo(
    () => studentsQuery.data ?? [],
    [studentsQuery.data],
  );
  const subjects = useMemo(
    () => subjectsQuery.data ?? [],
    [subjectsQuery.data],
  );

  const previewPct =
    Number(maximumMarks) > 0
      ? ((Number(marksObtained) || 0) / Number(maximumMarks)) * 100
      : 0;

  const submit = (values: ResultFormValues) => {
    onSubmit({
      studentId: values.studentId,
      subjectId: values.subjectId,
      marksObtained: values.marksObtained,
      maximumMarks: values.maximumMarks,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit result" : "Add result"}</DialogTitle>
          <DialogDescription>
            Percentage, grade and pass/fail status are calculated by the
            server.
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
                      studentsQuery.isLoading
                        ? "Loading..."
                        : "Select student"
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
                      subjectsQuery.isLoading
                        ? "Loading..."
                        : "Select subject"
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
              <Label htmlFor="marksObtained">Marks obtained</Label>
              <Input
                id="marksObtained"
                type="number"
                step="0.01"
                min={0}
                aria-invalid={!!errors.marksObtained}
                {...register("marksObtained", { valueAsNumber: true })}
              />
              {errors.marksObtained && (
                <p className="text-xs text-destructive">
                  {errors.marksObtained.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="maximumMarks">Maximum marks</Label>
              <Input
                id="maximumMarks"
                type="number"
                step="0.01"
                min={1}
                aria-invalid={!!errors.maximumMarks}
                {...register("maximumMarks", { valueAsNumber: true })}
              />
              {errors.maximumMarks && (
                <p className="text-xs text-destructive">
                  {errors.maximumMarks.message}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-muted/40 p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Preview percentage
              </span>
              <span className="font-semibold">
                {previewPct.toFixed(2)}%
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Final grade and pass/fail status will appear after saving.
            </p>
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
              {submitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editing ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
