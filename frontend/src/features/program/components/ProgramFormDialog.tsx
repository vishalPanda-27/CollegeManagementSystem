import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { programSchema, type ProgramFormValues } from "../schemas/programSchema";
import type { Program, ProgramRequest } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Program | null;
  submitting: boolean;
  onSubmit: (payload: ProgramRequest) => void;
}

export function ProgramFormDialog({
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
  } = useForm<ProgramFormValues>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      programName: "",
      programCode: "",
      durationYears: 4,
      description: "",
      departmentId: 0,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        programName: editing?.programName ?? "",
        programCode: editing?.programCode ?? "",
        durationYears: editing?.durationYears ?? 4,
        description: editing?.description ?? "",
        departmentId: editing?.departmentId ?? 0,
      });
    }
  }, [open, editing, reset]);

  const departmentId = watch("departmentId");

  const submit = (values: ProgramFormValues) => {
    onSubmit({
      programName: values.programName.trim(),
      programCode: values.programCode.trim(),
      durationYears: values.durationYears,
      description: values.description?.trim() || undefined,
      departmentId: values.departmentId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit program" : "New program"}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? "Update the details for this academic program."
              : "Create a new academic program under a department."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <FormField
            label="Program name"
            placeholder="Bachelor of Computer Science"
            registration={register("programName")}
            error={errors.programName}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Program code"
              placeholder="BCS"
              registration={register("programCode")}
              error={errors.programCode}
            />
            <FormField
              label="Duration (years)"
              type="number"
              min={1}
              max={10}
              registration={register("durationYears", { valueAsNumber: true })}
              error={errors.durationYears}
            />
          </div>
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
                      ? "Loading departments..."
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
