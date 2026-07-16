import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { attendanceApi } from "../api/attendanceApi";
import type { Attendance, AttendanceRequest } from "../types";

export const ATTENDANCE_KEY = ["attendance"] as const;

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

export function useAttendanceList() {
  return useQuery({ queryKey: ATTENDANCE_KEY, queryFn: attendanceApi.list });
}

export function useAttendance(id: number | null | undefined) {
  return useQuery({
    queryKey: ["attendance", id],
    queryFn: () => attendanceApi.get(id as number),
    enabled: id != null,
  });
}

export function useAttendanceByStudent(id: number | null | undefined) {
  return useQuery({
    queryKey: ["attendance", "student", id],
    queryFn: () => attendanceApi.listByStudent(id as number),
    enabled: id != null,
  });
}

export function useAttendanceBySubject(id: number | null | undefined) {
  return useQuery({
    queryKey: ["attendance", "subject", id],
    queryFn: () => attendanceApi.listBySubject(id as number),
    enabled: id != null,
  });
}

export function useAttendanceByTeacher(id: number | null | undefined) {
  return useQuery({
    queryKey: ["attendance", "teacher", id],
    queryFn: () => attendanceApi.listByTeacher(id as number),
    enabled: id != null,
  });
}

export function useAttendanceByDate(date: string | null | undefined) {
  return useQuery({
    queryKey: ["attendance", "date", date],
    queryFn: () => attendanceApi.listByDate(date as string),
    enabled: !!date,
  });
}

export function useCreateAttendance(onDone?: (a: Attendance) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AttendanceRequest) => attendanceApi.create(data),
    onSuccess: (a) => {
      qc.invalidateQueries({ queryKey: ["attendance"] });
      toast.success("Attendance marked");
      onDone?.(a);
    },
    onError: (e) => toast.error(errMsg(e, "Failed to mark attendance")),
  });
}

export function useUpdateAttendance(onDone?: (a: Attendance) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AttendanceRequest }) =>
      attendanceApi.update(id, data),
    onSuccess: (a) => {
      qc.invalidateQueries({ queryKey: ["attendance"] });
      toast.success("Attendance updated");
      onDone?.(a);
    },
    onError: (e) => toast.error(errMsg(e, "Failed to update attendance")),
  });
}

export function useDeleteAttendance(onDone?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => attendanceApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["attendance"] });
      toast.success("Attendance deleted");
      onDone?.();
    },
    onError: (e) => toast.error(errMsg(e, "Failed to delete attendance")),
  });
}
