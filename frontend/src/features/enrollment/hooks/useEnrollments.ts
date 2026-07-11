import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { enrollmentApi } from "../api/enrollmentApi";
import type { Enrollment, EnrollmentRequest, EnrollmentStatus } from "../types";

export const ENROLLMENTS_KEY = ["enrollments"] as const;

function errMsg(e: unknown, fallback: string): string {
  const anyE = e as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  return anyE?.response?.data?.message ?? anyE?.message ?? fallback;
}

export function useEnrollments() {
  return useQuery({ queryKey: ENROLLMENTS_KEY, queryFn: enrollmentApi.list });
}

export function useEnrollment(id: number | string | null | undefined) {
  return useQuery({
    queryKey: ["enrollments", id],
    queryFn: () => enrollmentApi.get(id as number),
    enabled: id !== null && id !== undefined,
  });
}

export function useEnrollmentsByStatus(status: EnrollmentStatus) {
  return useQuery({
    queryKey: ["enrollments", "status", status],
    queryFn: () => enrollmentApi.listByStatus(status),
  });
}

export function useEnrollmentsByStudent(
  studentId: number | string | null | undefined,
) {
  return useQuery({
    queryKey: ["enrollments", "student", studentId],
    queryFn: () => enrollmentApi.listByStudent(studentId as number),
    enabled: studentId !== null && studentId !== undefined,
  });
}

export function useActiveEnrollmentsByStudent(
  studentId: number | string | null | undefined,
) {
  return useQuery({
    queryKey: ["enrollments", "student", studentId, "active"],
    queryFn: () => enrollmentApi.listActiveByStudent(studentId as number),
    enabled: studentId !== null && studentId !== undefined,
  });
}

export function useCompletedEnrollmentsByStudent(
  studentId: number | string | null | undefined,
) {
  return useQuery({
    queryKey: ["enrollments", "student", studentId, "completed"],
    queryFn: () => enrollmentApi.listCompletedByStudent(studentId as number),
    enabled: studentId !== null && studentId !== undefined,
  });
}

export function useEnrollmentsByCourse(
  courseId: number | string | null | undefined,
) {
  return useQuery({
    queryKey: ["enrollments", "course", courseId],
    queryFn: () => enrollmentApi.listByCourse(courseId as number),
    enabled: courseId !== null && courseId !== undefined,
  });
}

export function useCreateEnrollment(onDone?: (e: Enrollment) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: EnrollmentRequest) => enrollmentApi.create(data),
    onSuccess: (e) => {
      qc.invalidateQueries({ queryKey: ENROLLMENTS_KEY });
      toast.success("Enrollment created");
      onDone?.(e);
    },
    onError: (e) => toast.error(errMsg(e, "Failed to create enrollment")),
  });
}

export function useUpdateEnrollment(onDone?: (e: Enrollment) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EnrollmentRequest }) =>
      enrollmentApi.update(id, data),
    onSuccess: (e) => {
      qc.invalidateQueries({ queryKey: ENROLLMENTS_KEY });
      qc.invalidateQueries({ queryKey: ["enrollments", e.enrollmentId] });
      toast.success("Enrollment updated");
      onDone?.(e);
    },
    onError: (e) => toast.error(errMsg(e, "Failed to update enrollment")),
  });
}

export function useDeleteEnrollment(onDone?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => enrollmentApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ENROLLMENTS_KEY });
      toast.success("Enrollment deleted");
      onDone?.();
    },
    onError: (e) => toast.error(errMsg(e, "Failed to delete enrollment")),
  });
}

export function useCompleteEnrollment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => enrollmentApi.complete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ENROLLMENTS_KEY });
      toast.success("Enrollment completed");
    },
    onError: (e) => toast.error(errMsg(e, "Failed to complete enrollment")),
  });
}

export function useDropEnrollment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => enrollmentApi.drop(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ENROLLMENTS_KEY });
      toast.success("Enrollment dropped");
    },
    onError: (e) => toast.error(errMsg(e, "Failed to drop enrollment")),
  });
}
