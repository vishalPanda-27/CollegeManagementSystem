import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import { FormField } from "@/components/forms/FormField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { departmentsApi } from "@/api/departments";
import { usersApi } from "@/api/users";
import { subjectApi } from "@/features/subject/api/subjectApi";
import { courseApi } from "@/features/course/api/courseApi";
import { MultiSelect } from "./MultiSelect";
import {
  teacherSchema,
  type TeacherFormValues,
} from "../schemas/teacherSchema";
import type { Teacher, TeacherRequest } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Teacher | null;
  submitting: boolean;
  onSubmit: (payload: TeacherRequest) => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export function TeacherFormDialog({
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
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: usersApi.list,
    enabled: open,
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      qualification: "",
      specialization: "",
      joiningDate: today(),
      salary: 0,
      active: true,
      departmentId: 0,
      userId: null,
      subjectIds: [],
      courseIds: [],
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        firstName: editing?.firstName ?? "",
        lastName: editing?.lastName ?? "",
        email: editing?.email ?? "",
        phone: editing?.phone ?? "",
        qualification: editing?.qualification ?? "",
        specialization: editing?.specialization ?? "",
        joiningDate: editing?.joiningDate ?? today(),
        salary: editing?.salary ?? 0,
        active: editing?.active ?? true,
        departmentId: editing?.departmentId ?? 0,
        userId: editing?.userId ?? null,
        subjectIds: editing?.subjectIds ?? [],
        courseIds: editing?.courseIds ?? [],
      });
    }
  }, [open, editing, reset]);

  const departmentId = watch("departmentId");
  const active = watch("active");
  const userId = watch("userId");

  const subjectsQuery = useQuery({
    queryKey: ["subjects", "byDepartment", departmentId],
    queryFn: () => subjectApi.listByDepartment(departmentId),
    enabled: open && !!departmentId,
  });
  const coursesQuery = useQuery({
    queryKey: ["courses", "byDepartment", departmentId],
    queryFn: () => courseApi.listByDepartment(departmentId),
    enabled: open && !!departmentId,
  });

  const subjectOptions = useMemo(
    () =>
      (subjectsQuery.data ?? []).map((s) => ({
        value: s.id,
        label: s.subjectName,
        hint: s.subjectCode,
      })),
    [subjectsQuery.data],
  );
  const courseOptions = useMemo(
    () =>
      (coursesQuery.data ?? []).map((c) => ({
        value: c.id,
        label: c.courseName,
        hint: c.courseCode,
      })),
    [coursesQuery.data],
  );

  const submit = (values: TeacherFormValues) => {
    onSubmit({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      qualification: values.qualification.trim(),
      specialization: values.specialization.trim(),
      joiningDate: values.joiningDate,
      salary: values.salary,
      active: values.active,
      departmentId: values.departmentId,
      userId: values.userId ?? undefined,
      subjectIds: values.subjectIds ?? [],
      courseIds: values.courseIds ?? [],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit teacher" : "New teacher"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Update the profile, department assignment, and teaching load."
              : "Add a faculty member and assign them to a department."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="First name"
              placeholder="Anita"
              registration={register("firstName")}
              error={errors.firstName}
            />
            <FormField
              label="Last name"
              placeholder="Rao"
              registration={register("lastName")}
              error={errors.lastName}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Email"
              type="email"
              placeholder="anita@college.edu"
              registration={register("email")}
              error={errors.email}
            />
            <FormField
              label="Phone"
              placeholder="+91 90000 00000"
              registration={register("phone")}
              error={errors.phone}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Qualification"
              placeholder="Ph.D. Computer Science"
              registration={register("qualification")}
              error={errors.qualification}
            />
            <FormField
              label="Specialization"
              placeholder="Machine Learning"
              registration={register("specialization")}
              error={errors.specialization}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              label="Joining date"
              type="date"
              registration={register("joiningDate")}
              error={errors.joiningDate}
            />
            <FormField
              label="Salary"
              type="number"
              step="0.01"
              min={0}
              registration={register("salary", { valueAsNumber: true })}
              error={errors.salary}
            />
            <div className="space-y-1.5">
              <Label>Status</Label>
              <div className="flex h-9 items-center gap-3 rounded-md border bg-background px-3">
                <Switch
                  checked={active}
                  onCheckedChange={(v) =>
                    setValue("active", v, { shouldDirty: true })
                  }
                />
                <span className="text-sm text-muted-foreground">
                  {active ? "Active" : "Inactive"}
                </span>
              </div>
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
                  setValue("subjectIds", [], { shouldDirty: true });
                  setValue("courseIds", [], { shouldDirty: true });
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
              <Label>User account (optional)</Label>
              <Select
                value={userId ? String(userId) : "none"}
                onValueChange={(v) =>
                  setValue("userId", v === "none" ? null : Number(v), {
                    shouldDirty: true,
                  })
                }
                disabled={usersQuery.isLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      usersQuery.isLoading ? "Loading..." : "No user linked"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No user linked</SelectItem>
                  {usersQuery.data?.map((u) => (
                    <SelectItem key={u.id} value={String(u.id)}>
                      {u.username} · {u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Subjects</Label>
            <Controller
              control={control}
              name="subjectIds"
              render={({ field }) => (
                <MultiSelect
                  options={subjectOptions}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  disabled={!departmentId}
                  loading={subjectsQuery.isLoading && !!departmentId}
                  placeholder={
                    departmentId
                      ? "Select subjects"
                      : "Select a department first"
                  }
                  emptyText="No subjects in this department."
                />
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Courses</Label>
            <Controller
              control={control}
              name="courseIds"
              render={({ field }) => (
                <MultiSelect
                  options={courseOptions}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  disabled={!departmentId}
                  loading={coursesQuery.isLoading && !!departmentId}
                  placeholder={
                    departmentId ? "Select courses" : "Select a department first"
                  }
                  emptyText="No courses in this department."
                />
              )}
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
