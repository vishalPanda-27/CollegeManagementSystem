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
import {
  classroomSchema,
  type ClassroomFormValues,
} from "../schemas/classroomSchema";
import {
  ROOM_STATUSES,
  ROOM_STATUS_LABELS,
  ROOM_TYPES,
  ROOM_TYPE_LABELS,
  type Classroom,
  type ClassroomRequest,
  type RoomStatus,
  type RoomType,
} from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Classroom | null;
  submitting: boolean;
  onSubmit: (payload: ClassroomRequest) => void;
}

export function ClassroomFormDialog({
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
  } = useForm<ClassroomFormValues>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      roomNumber: "",
      buildingName: "",
      floor: undefined,
      capacity: 30,
      roomType: "LECTURE_HALL",
      status: "AVAILABLE",
      departmentId: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        roomNumber: editing?.roomNumber ?? "",
        buildingName: editing?.buildingName ?? "",
        floor: editing?.floor ?? undefined,
        capacity: editing?.capacity ?? 30,
        roomType: editing?.roomType ?? "LECTURE_HALL",
        status: editing?.status ?? "AVAILABLE",
        departmentId: editing?.departmentId ?? undefined,
      });
    }
  }, [open, editing, reset]);

  const roomType = watch("roomType");
  const status = watch("status");
  const departmentId = watch("departmentId");

  const submit = (values: ClassroomFormValues) => {
    onSubmit({
      roomNumber: values.roomNumber.trim(),
      buildingName: values.buildingName.trim(),
      floor: values.floor ?? null,
      capacity: values.capacity,
      roomType: values.roomType as RoomType,
      status: values.status as RoomStatus,
      departmentId: values.departmentId ?? null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit classroom" : "New classroom"}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? "Update the details for this classroom."
              : "Create a new classroom in a building."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Room number"
              placeholder="A-101"
              registration={register("roomNumber")}
              error={errors.roomNumber}
            />
            <FormField
              label="Building name"
              placeholder="Science Block"
              registration={register("buildingName")}
              error={errors.buildingName}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Floor"
              type="number"
              min={0}
              placeholder="0"
              registration={register("floor", { valueAsNumber: true })}
              error={errors.floor}
            />
            <FormField
              label="Capacity"
              type="number"
              min={30}
              registration={register("capacity", { valueAsNumber: true })}
              error={errors.capacity}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Room type</Label>
              <Select
                value={roomType || ""}
                onValueChange={(v) =>
                  setValue("roomType", v as RoomType, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger aria-invalid={!!errors.roomType}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {ROOM_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {ROOM_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.roomType && (
                <p className="text-xs text-destructive">
                  {errors.roomType.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Room status</Label>
              <Select
                value={status || ""}
                onValueChange={(v) =>
                  setValue("status", v as RoomStatus, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger aria-invalid={!!errors.status}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {ROOM_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {ROOM_STATUS_LABELS[s]}
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
          </div>

          <div className="space-y-1.5">
            <Label>Department (optional)</Label>
            <Select
              value={departmentId ? String(departmentId) : "none"}
              onValueChange={(v) =>
                setValue("departmentId", v === "none" ? undefined : Number(v), {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              disabled={departmentsQuery.isLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    departmentsQuery.isLoading
                      ? "Loading..."
                      : "No department"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No department</SelectItem>
                {departmentsQuery.data?.map((d) => (
                  <SelectItem key={d.id} value={String(d.id)}>
                    {d.name} ({d.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
