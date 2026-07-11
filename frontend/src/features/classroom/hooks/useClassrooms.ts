import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { classroomApi } from "../api/classroomApi";
import type { Classroom, ClassroomRequest, RoomStatus } from "../types";

export const CLASSROOMS_KEY = ["classrooms"] as const;

function errMsg(e: unknown, fallback: string): string {
  const anyE = e as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  return anyE?.response?.data?.message ?? anyE?.message ?? fallback;
}

export function useClassrooms() {
  return useQuery({ queryKey: CLASSROOMS_KEY, queryFn: classroomApi.list });
}

export function useClassroom(id: number | string | null | undefined) {
  return useQuery({
    queryKey: ["classrooms", id],
    queryFn: () => classroomApi.get(id as number),
    enabled: id !== null && id !== undefined,
  });
}

export function useCreateClassroom(onDone?: (c: Classroom) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ClassroomRequest) => classroomApi.create(data),
    onSuccess: (c) => {
      qc.invalidateQueries({ queryKey: CLASSROOMS_KEY });
      toast.success("Classroom created");
      onDone?.(c);
    },
    onError: (e) => toast.error(errMsg(e, "Failed to create classroom")),
  });
}

export function useUpdateClassroom(onDone?: (c: Classroom) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ClassroomRequest }) =>
      classroomApi.update(id, data),
    onSuccess: (c) => {
      qc.invalidateQueries({ queryKey: CLASSROOMS_KEY });
      qc.invalidateQueries({ queryKey: ["classrooms", c.id] });
      toast.success("Classroom updated");
      onDone?.(c);
    },
    onError: (e) => toast.error(errMsg(e, "Failed to update classroom")),
  });
}

export function useDeleteClassroom(onDone?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => classroomApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CLASSROOMS_KEY });
      toast.success("Classroom deleted");
      onDone?.();
    },
    onError: (e) => toast.error(errMsg(e, "Failed to delete classroom")),
  });
}

export function useChangeClassroomStatus(onDone?: (c: Classroom) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: RoomStatus }) =>
      classroomApi.changeStatus(id, status),
    onSuccess: (c) => {
      qc.invalidateQueries({ queryKey: CLASSROOMS_KEY });
      qc.invalidateQueries({ queryKey: ["classrooms", c.id] });
      toast.success("Status updated");
      onDone?.(c);
    },
    onError: (e) => toast.error(errMsg(e, "Failed to update status")),
  });
}
