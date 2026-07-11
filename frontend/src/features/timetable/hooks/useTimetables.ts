import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { timetableApi } from "../api/timetableApi";
import type { DayOfWeek, Timetable, TimetableRequest } from "../types";

export const TIMETABLES_KEY = ["timetables"] as const;

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

export function useTimetables() {
  return useQuery({ queryKey: TIMETABLES_KEY, queryFn: timetableApi.list });
}

export function useTimetable(id: number | string | null | undefined) {
  return useQuery({
    queryKey: ["timetables", id],
    queryFn: () => timetableApi.get(id as number),
    enabled: id !== null && id !== undefined,
  });
}

export function useTimetablesByTeacher(id: number | null | undefined) {
  return useQuery({
    queryKey: ["timetables", "teacher", id],
    queryFn: () => timetableApi.listByTeacher(id as number),
    enabled: id !== null && id !== undefined,
  });
}

export function useTimetablesByClassroom(id: number | null | undefined) {
  return useQuery({
    queryKey: ["timetables", "classroom", id],
    queryFn: () => timetableApi.listByClassroom(id as number),
    enabled: id !== null && id !== undefined,
  });
}

export function useTimetablesByCourse(id: number | null | undefined) {
  return useQuery({
    queryKey: ["timetables", "course", id],
    queryFn: () => timetableApi.listByCourse(id as number),
    enabled: id !== null && id !== undefined,
  });
}

export function useTimetablesByDay(day: DayOfWeek | null | undefined) {
  return useQuery({
    queryKey: ["timetables", "day", day],
    queryFn: () => timetableApi.listByDay(day as DayOfWeek),
    enabled: !!day,
  });
}

export function useTimetableCount() {
  return useQuery({
    queryKey: ["timetables", "count"],
    queryFn: timetableApi.count,
  });
}

export function useCreateTimetable(onDone?: (t: Timetable) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: TimetableRequest) => timetableApi.create(data),
    onSuccess: (t) => {
      qc.invalidateQueries({ queryKey: ["timetables"] });
      toast.success("Timetable entry created");
      onDone?.(t);
    },
    onError: (e) => toast.error(errMsg(e, "Failed to create timetable")),
  });
}

export function useUpdateTimetable(onDone?: (t: Timetable) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TimetableRequest }) =>
      timetableApi.update(id, data),
    onSuccess: (t) => {
      qc.invalidateQueries({ queryKey: ["timetables"] });
      toast.success("Timetable entry updated");
      onDone?.(t);
    },
    onError: (e) => toast.error(errMsg(e, "Failed to update timetable")),
  });
}

export function useDeleteTimetable(onDone?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => timetableApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["timetables"] });
      toast.success("Timetable entry deleted");
      onDone?.();
    },
    onError: (e) => toast.error(errMsg(e, "Failed to delete timetable")),
  });
}
