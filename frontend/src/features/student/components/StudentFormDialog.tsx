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
import {
  studentSchema,
  type StudentFormValues,
} from "../schemas/studentSchema";
import {
  STUDENT_STATUSES,
  STUDENT_STATUS_LABEL,
  type Student,
  type StudentRequest,
  type StudentStatus,
} from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Student | null;
  submitting: boolean;
  onSubmit: (payload: StudentRequest) => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export function StudentFormDialog({
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
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      rollNumber: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      admissionDate: today(),
      status: "ACTIVE",
      departmentId: 0,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        rollNumber: editing?.rollNumber ?? "",
        firstName: editing?.firstName ?? "",
        lastName: editing?.lastName ?? "",
        email: editing?.email ?? "",
        phoneNumber: editing?.phoneNumber ?? "",
        dateOfBirth: editing?.dateOfBirth ?? "",
        gender: editing?.gender ?? "",
        address: editing?.address ?? "",
        admissionDate: editing?.admissionDate ?? today(),
        status: editing?.status ?? "ACTIVE",
        departmentId: editing?.departmentId ?? 0,
      });
    }
  }, [open, editing, reset]);

  const departmentId = watch("departmentId");
  const gender = watch("gender");
  const status = watch("status");

  const submit = (values: StudentFormValues) => {
    onSubmit({
      rollNumber: values.rollNumber.trim(),
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phoneNumber: values.phoneNumber.trim(),
      dateOfBirth: values.dateOfBirth || null,
      gender: values.gender,
      address: values.address?.trim() || null,
      admissionDate: values.admissionDate,
      status: values.status as StudentStatus,
      departmentId: values.departmentId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit student" : "New student"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Update the student's personal information and enrollment."
              : "Register a new student and assign them to a department."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Roll number"
              placeholder="CS22001"
              registration={register("rollNumber")}
              error={errors.rollNumber}
            />
            <div className="space-y-1.5">
              <Label>Department</Label>
              <Select
                value={departmentId ? String(departmentId) : ""}
                onValueChange={(v) =>
                  setValue("departmentId", Number(v), {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
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

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="First name"
              placeholder="Priya"
              registration={register("firstName")}
              error={errors.firstName}
            />
            <FormField
              label="Last name"
              placeholder="Sharma"
              registration={register("lastName")}
              error={errors.lastName}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Email"
              type="email"
              placeholder="priya@college.edu"
              registration={register("email")}
              error={errors.email}
            />
            <FormField
              label="Phone number"
              placeholder="+91 90000 00000"
              registration={register("phoneNumber")}
              error={errors.phoneNumber}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              label="Date of birth"
              type="date"
              registration={register("dateOfBirth")}
              error={errors.dateOfBirth}
            />
            <div className="space-y-1.5">
              <Label>Gender</Label>
              <Select
                value={gender || ""}
                onValueChange={(v) =>
                  setValue("gender", v, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger aria-invalid={!!errors.gender}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-xs text-destructive">
                  {errors.gender.message}
                </p>
              )}
            </div>
            <FormField
              label="Admission date"
              type="date"
              registration={register("admissionDate")}
              error={errors.admissionDate}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) =>
                setValue("status", v as StudentStatus, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger className="sm:max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STUDENT_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STUDENT_STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              rows={3}
              placeholder="Street, city, state, postal code"
              {...register("address")}
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
