import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { classScheduleApi } from "../api/classScheduleApi";
import type {
  ClassSchedule,
  ClassScheduleRequest,
  DayOfWeek,
} from "../types";

export const SCHEDULES_KEY = ["classSchedules"] as const;

function errMsg(e: unknown, fallback: string): string {
  const anyE = e as {
    response?: { data?: { message?: string; error?: string } };
    message?: string;
  };
  return (
    anyE?.response?.data?.message ??
    anyE?.response?.data?.error ??
    anyE?.message ??
    fallback
  );
}

export function useClassSchedules() {
  return useQuery({ queryKey: SCHEDULES_KEY, queryFn: classScheduleApi.list });
}

export function useClassSchedule(id: number | null | undefined) {
  return useQuery({
    queryKey: ["classSchedules", id],
    queryFn: () => classScheduleApi.get(id as number),
    enabled: id !== null && id !== undefined,
  });
}

export function useSchedulesByTeacher(id: number | null | undefined) {
  return useQuery({
    queryKey: ["classSchedules", "teacher", id],
    queryFn: () => classScheduleApi.listByTeacher(id as number),
    enabled: id !== null && id !== undefined,
  });
}

export function useSchedulesByClassroom(id: number | null | undefined) {
  return useQuery({
    queryKey: ["classSchedules", "classroom", id],
    queryFn: () => classScheduleApi.listByClassroom(id as number),
    enabled: id !== null && id !== undefined,
  });
}

export function useSchedulesByDay(day: DayOfWeek | null | undefined) {
  return useQuery({
    queryKey: ["classSchedules", "day", day],
    queryFn: () => classScheduleApi.listByDay(day as DayOfWeek),
    enabled: !!day,
  });
}

export function useCreateClassSchedule(onDone?: (s: ClassSchedule) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ClassScheduleRequest) => classScheduleApi.create(data),
    onSuccess: (s) => {
      qc.invalidateQueries({ queryKey: ["classSchedules"] });
      toast.success("Schedule created");
      onDone?.(s);
    },
    onError: (e) => toast.error(errMsg(e, "Failed to create schedule")),
  });
}

export function useUpdateClassSchedule(onDone?: (s: ClassSchedule) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ClassScheduleRequest }) =>
      classScheduleApi.update(id, data),
    onSuccess: (s) => {
      qc.invalidateQueries({ queryKey: ["classSchedules"] });
      toast.success("Schedule updated");
      onDone?.(s);
    },
    onError: (e) => toast.error(errMsg(e, "Failed to update schedule")),
  });
}

export function useDeleteClassSchedule(onDone?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => classScheduleApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["classSchedules"] });
      toast.success("Schedule deleted");
      onDone?.();
    },
    onError: (e) => toast.error(errMsg(e, "Failed to delete schedule")),
  });
}
