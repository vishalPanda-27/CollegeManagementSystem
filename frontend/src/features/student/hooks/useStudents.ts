import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { studentApi } from "../api/studentApi";
import type { Student, StudentRequest, StudentStatus } from "../types";

export const STUDENTS_KEY = ["students"] as const;

function errMsg(e: unknown, fallback: string): string {
  const anyE = e as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  return anyE?.response?.data?.message ?? anyE?.message ?? fallback;
}

export function useStudents() {
  return useQuery({ queryKey: STUDENTS_KEY, queryFn: studentApi.list });
}

export function useStudent(id: number | string | null | undefined) {
  return useQuery({
    queryKey: ["students", id],
    queryFn: () => studentApi.get(id as number),
    enabled: id !== null && id !== undefined,
  });
}

export function useStudentCount() {
  return useQuery({
    queryKey: ["students", "count"],
    queryFn: studentApi.count,
  });
}

export function useStudentCountByStatus(status: StudentStatus) {
  return useQuery({
    queryKey: ["students", "count", "status", status],
    queryFn: () => studentApi.countByStatus(status),
  });
}

export function useCreateStudent(onDone?: (s: Student) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: StudentRequest) => studentApi.create(data),
    onSuccess: (s) => {
      qc.invalidateQueries({ queryKey: STUDENTS_KEY });
      toast.success("Student created");
      onDone?.(s);
    },
    onError: (e) => toast.error(errMsg(e, "Failed to create student")),
  });
}

export function useUpdateStudent(onDone?: (s: Student) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: StudentRequest }) =>
      studentApi.update(id, data),
    onSuccess: (s) => {
      qc.invalidateQueries({ queryKey: STUDENTS_KEY });
      qc.invalidateQueries({ queryKey: ["students", s.id] });
      toast.success("Student updated");
      onDone?.(s);
    },
    onError: (e) => toast.error(errMsg(e, "Failed to update student")),
  });
}

export function useDeleteStudent(onDone?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => studentApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: STUDENTS_KEY });
      toast.success("Student deleted");
      onDone?.();
    },
    onError: (e) => toast.error(errMsg(e, "Failed to delete student")),
  });
}

export function useSetStudentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: StudentStatus }) => {
      switch (status) {
        case "ACTIVE":
          return studentApi.activate(id);
        case "INACTIVE":
          return studentApi.deactivate(id);
        case "SUSPENDED":
          return studentApi.suspend(id);
        case "GRADUATED":
          return studentApi.graduate(id);
      }
    },
    onSuccess: (s) => {
      qc.invalidateQueries({ queryKey: STUDENTS_KEY });
      toast.success(`Student status set to ${s.status.toLowerCase()}`);
    },
    onError: (e) => toast.error(errMsg(e, "Failed to update status")),
  });
}
