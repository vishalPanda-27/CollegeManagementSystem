import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { courseApi } from "../api/courseApi";
import type { Course, CourseRequest } from "../types";

export const COURSES_KEY = ["courses"] as const;

function errMsg(e: unknown, fallback: string): string {
  const anyE = e as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  return anyE?.response?.data?.message ?? anyE?.message ?? fallback;
}

export function useCourses() {
  return useQuery({ queryKey: COURSES_KEY, queryFn: courseApi.list });
}

export function useCourse(id: number | string | null | undefined) {
  return useQuery({
    queryKey: ["courses", id],
    queryFn: () => courseApi.get(id as number),
    enabled: id !== null && id !== undefined,
  });
}

export function useCreateCourse(onDone?: (c: Course) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CourseRequest) => courseApi.create(data),
    onSuccess: (c) => {
      qc.invalidateQueries({ queryKey: COURSES_KEY });
      toast.success("Course created");
      onDone?.(c);
    },
    onError: (e) => toast.error(errMsg(e, "Failed to create course")),
  });
}

export function useUpdateCourse(onDone?: (c: Course) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CourseRequest }) =>
      courseApi.update(id, data),
    onSuccess: (c) => {
      qc.invalidateQueries({ queryKey: COURSES_KEY });
      qc.invalidateQueries({ queryKey: ["courses", c.id] });
      toast.success("Course updated");
      onDone?.(c);
    },
    onError: (e) => toast.error(errMsg(e, "Failed to update course")),
  });
}

export function useDeleteCourse(onDone?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => courseApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: COURSES_KEY });
      toast.success("Course deleted");
      onDone?.();
    },
    onError: (e) => toast.error(errMsg(e, "Failed to delete course")),
  });
}
