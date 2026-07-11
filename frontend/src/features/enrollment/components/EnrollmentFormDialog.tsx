import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { studentApi } from "@/features/student/api/studentApi";
import { courseApi } from "@/features/course/api/courseApi";
import {
  enrollmentSchema,
  type EnrollmentFormValues,
} from "../schemas/enrollmentSchema";
import {
  ENROLLMENT_STATUSES,
  ENROLLMENT_STATUS_LABEL,
  type Enrollment,
  type EnrollmentRequest,
  type EnrollmentStatus,
} from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Enrollment | null;
  submitting: boolean;
  onSubmit: (payload: EnrollmentRequest) => void;
}

const today = () => new Date().toISOString().slice(0, 10);
const currentAcademicYear = () => {
  const y = new Date().getFullYear();
  return `${y}-${y + 1}`;
};

export function EnrollmentFormDialog({
  open,
  onOpenChange,
  editing,
  submitting,
  onSubmit,
}: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [studentSearch, setStudentSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [studentPopoverOpen, setStudentPopoverOpen] = useState(false);
  const [coursePopoverOpen, setCoursePopoverOpen] = useState(false);

  const studentsQuery = useQuery({
    queryKey: ["students"],
    queryFn: studentApi.list,
    enabled: open,
  });
  const coursesQuery = useQuery({
    queryKey: ["courses"],
    queryFn: courseApi.list,
    enabled: open,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      studentId: 0,
      courseId: 0,
      enrollmentDate: today(),
      semester: "",
      academicYear: currentAcademicYear(),
      status: "ENROLLED",
      grade: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      setStep(1);
      setStudentSearch("");
      setCourseSearch("");
      reset({
        studentId: editing?.studentId ?? 0,
        courseId: editing?.courseId ?? 0,
        enrollmentDate: editing?.enrollmentDate ?? today(),
        semester: editing?.semester ?? "",
        academicYear: editing?.academicYear ?? currentAcademicYear(),
        status: editing?.status ?? "ENROLLED",
        grade: editing?.grade ?? undefined,
      });
      if (editing) setStep(2);
    }
  }, [open, editing, reset]);

  const studentId = watch("studentId");
  const courseId = watch("courseId");
  const status = watch("status");

  const activeStudents = useMemo(
    () => (studentsQuery.data ?? []).filter((s) => s.status === "ACTIVE"),
    [studentsQuery.data],
  );

  const selectedStudent = useMemo(
    () =>
      (studentsQuery.data ?? []).find((s) => s.id === studentId) ??
      (editing && editing.studentId === studentId
        ? {
            id: editing.studentId,
            rollNumber: "",
            firstName: editing.studentName,
            lastName: "",
            departmentName: null,
            status: "ACTIVE" as const,
          }
        : null),
    [studentsQuery.data, studentId, editing],
  );

  const selectedCourse = useMemo(
    () =>
      (coursesQuery.data ?? []).find((c) => c.id === courseId) ??
      (editing && editing.courseId === courseId
        ? {
            id: editing.courseId,
            courseCode: "",
            courseName: editing.courseName,
            departmentName: null,
          }
        : null),
    [coursesQuery.data, courseId, editing],
  );

  const submit = (values: EnrollmentFormValues) => {
    onSubmit({
      studentId: values.studentId,
      courseId: values.courseId,
      enrollmentDate: values.enrollmentDate || null,
      semester: values.semester?.trim() || null,
      academicYear: values.academicYear?.trim() || null,
      status: (values.status ?? "ENROLLED") as EnrollmentStatus,
      grade:
        values.grade === undefined || Number.isNaN(values.grade as number)
          ? null
          : (values.grade as number),
    });
  };

  const goNext = async () => {
    const ok = await trigger(["studentId", "courseId"]);
    if (ok) setStep(2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit enrollment" : "New enrollment"}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? "Update enrollment details. Student and course cannot be changed."
              : "Select a student, then a course, and confirm enrollment details."}
          </DialogDescription>
        </DialogHeader>

        {!editing && (
          <div className="mb-4 flex items-center gap-3 text-xs">
            <div
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1",
                step === 1
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground",
              )}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                1
              </span>
              Select student
            </div>
            <div className="h-px flex-1 bg-border" />
            <div
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1",
                step === 2
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold",
                  step === 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                2
              </span>
              Course & details
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          {step === 1 && !editing && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Student</Label>
                <Popover
                  open={studentPopoverOpen}
                  onOpenChange={setStudentPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between font-normal"
                    >
                      {selectedStudent
                        ? `${selectedStudent.firstName} ${selectedStudent.lastName}`.trim()
                        : "Search for a student..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command
                      filter={(value, search) =>
                        value.toLowerCase().includes(search.toLowerCase())
                          ? 1
                          : 0
                      }
                    >
                      <CommandInput
                        placeholder="Search by name or roll no..."
                        value={studentSearch}
                        onValueChange={setStudentSearch}
                      />
                      <CommandList>
                        <CommandEmpty>
                          {studentsQuery.isLoading
                            ? "Loading..."
                            : "No active students found."}
                        </CommandEmpty>
                        <CommandGroup>
                          {activeStudents.map((s) => {
                            const label = `${s.rollNumber} ${s.firstName} ${s.lastName} ${s.email}`;
                            return (
                              <CommandItem
                                key={s.id}
                                value={label}
                                onSelect={() => {
                                  setValue("studentId", s.id, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  });
                                  setStudentPopoverOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    studentId === s.id
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                <div className="flex flex-1 flex-col">
                                  <span className="text-sm font-medium">
                                    {s.firstName} {s.lastName}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {s.rollNumber} ·{" "}
                                    {s.departmentName ?? "No department"}
                                  </span>
                                </div>
                                <Badge variant="default" className="ml-2">
                                  Active
                                </Badge>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.studentId && (
                  <p className="text-xs text-destructive">
                    {errors.studentId.message}
                  </p>
                )}
              </div>

              {selectedStudent && (
                <div className="rounded-md border bg-muted/40 p-3 text-sm">
                  <div className="font-medium">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span>Roll: {selectedStudent.rollNumber || "—"}</span>
                    <span>
                      Dept: {selectedStudent.departmentName ?? "—"}
                    </span>
                    <span>Status: {selectedStudent.status}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {(step === 2 || editing) && (
            <div className="space-y-4">
              {editing ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-md border bg-muted/40 p-3 text-sm">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Student
                    </div>
                    <div className="mt-1 font-medium">
                      {editing.studentName}
                    </div>
                  </div>
                  <div className="rounded-md border bg-muted/40 p-3 text-sm">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Course
                    </div>
                    <div className="mt-1 font-medium">{editing.courseName}</div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <Label>Course</Label>
                    <Popover
                      open={coursePopoverOpen}
                      onOpenChange={setCoursePopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between font-normal"
                        >
                          {selectedCourse
                            ? `${selectedCourse.courseCode} · ${selectedCourse.courseName}`
                            : "Search for a course..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command
                          filter={(value, search) =>
                            value.toLowerCase().includes(search.toLowerCase())
                              ? 1
                              : 0
                          }
                        >
                          <CommandInput
                            placeholder="Search by code or name..."
                            value={courseSearch}
                            onValueChange={setCourseSearch}
                          />
                          <CommandList>
                            <CommandEmpty>
                              {coursesQuery.isLoading
                                ? "Loading..."
                                : "No courses found."}
                            </CommandEmpty>
                            <CommandGroup>
                              {(coursesQuery.data ?? []).map((c) => {
                                const label = `${c.courseCode} ${c.courseName}`;
                                return (
                                  <CommandItem
                                    key={c.id}
                                    value={label}
                                    onSelect={() => {
                                      setValue("courseId", c.id, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                      });
                                      setCoursePopoverOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        courseId === c.id
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    <div className="flex flex-1 flex-col">
                                      <span className="text-sm font-medium">
                                        {c.courseName}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {c.courseCode} ·{" "}
                                        {c.departmentName ?? "No department"}
                                      </span>
                                    </div>
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {errors.courseId && (
                      <p className="text-xs text-destructive">
                        {errors.courseId.message}
                      </p>
                    )}
                  </div>

                  {selectedCourse && (
                    <div className="rounded-md border bg-muted/40 p-3 text-sm">
                      <div className="font-medium">
                        {selectedCourse.courseName}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>Code: {selectedCourse.courseCode || "—"}</span>
                        <span>
                          Dept: {selectedCourse.departmentName ?? "—"}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    id="semester"
                    placeholder="e.g. Fall 2026"
                    {...register("semester")}
                    aria-invalid={!!errors.semester}
                  />
                  {errors.semester && (
                    <p className="text-xs text-destructive">
                      {errors.semester.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="academicYear">Academic year</Label>
                  <Input
                    id="academicYear"
                    placeholder="2026-2027"
                    {...register("academicYear")}
                    aria-invalid={!!errors.academicYear}
                  />
                  {errors.academicYear && (
                    <p className="text-xs text-destructive">
                      {errors.academicYear.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="enrollmentDate">Enrollment date</Label>
                  <Input
                    id="enrollmentDate"
                    type="date"
                    {...register("enrollmentDate")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select
                    value={status ?? "ENROLLED"}
                    onValueChange={(v) =>
                      setValue("status", v as EnrollmentStatus, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ENROLLMENT_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {ENROLLMENT_STATUS_LABEL[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="grade">Grade (0-10)</Label>
                  <Input
                    id="grade"
                    type="number"
                    step="0.01"
                    min={0}
                    max={10}
                    placeholder="—"
                    {...register("grade", {
                      setValueAs: (v) =>
                        v === "" || v === null || v === undefined
                          ? undefined
                          : Number(v),
                    })}
                    aria-invalid={!!errors.grade}
                  />
                  {errors.grade && (
                    <p className="text-xs text-destructive">
                      {errors.grade.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            {!editing && step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
            )}
            {!editing && step === 1 ? (
              <Button type="button" onClick={goNext}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={submitting}>
                {submitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editing ? "Update" : "Create enrollment"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
