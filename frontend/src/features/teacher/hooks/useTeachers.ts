import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { teacherApi } from "../api/teacherApi";
import type { Teacher, TeacherRequest } from "../types";

export const TEACHERS_KEY = ["teachers"] as const;

function errMsg(e: unknown, fallback: string): string {
  const anyE = e as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  return anyE?.response?.data?.message ?? anyE?.message ?? fallback;
}

export function useTeachers() {
  return useQuery({ queryKey: TEACHERS_KEY, queryFn: teacherApi.list });
}

export function useTeacher(id: number | string | null | undefined) {
  return useQuery({
    queryKey: ["teachers", id],
    queryFn: () => teacherApi.get(id as number),
    enabled: id !== null && id !== undefined,
  });
}

export function useTeacherCount() {
  return useQuery({ queryKey: ["teachers", "count"], queryFn: teacherApi.count });
}

export function useCreateTeacher(onDone?: (t: Teacher) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: TeacherRequest) => teacherApi.create(data),
    onSuccess: (t) => {
      qc.invalidateQueries({ queryKey: TEACHERS_KEY });
      toast.success("Teacher created");
      onDone?.(t);
    },
    onError: (e) => toast.error(errMsg(e, "Failed to create teacher")),
  });
}

export function useUpdateTeacher(onDone?: (t: Teacher) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TeacherRequest }) =>
      teacherApi.update(id, data),
    onSuccess: (t) => {
      qc.invalidateQueries({ queryKey: TEACHERS_KEY });
      qc.invalidateQueries({ queryKey: ["teachers", t.teacherId] });
      toast.success("Teacher updated");
      onDone?.(t);
    },
    onError: (e) => toast.error(errMsg(e, "Failed to update teacher")),
  });
}

export function useDeleteTeacher(onDone?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => teacherApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TEACHERS_KEY });
      toast.success("Teacher deleted");
      onDone?.();
    },
    onError: (e) => toast.error(errMsg(e, "Failed to delete teacher")),
  });
}

export function useSetTeacherStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      active ? teacherApi.activate(id) : teacherApi.deactivate(id),
    onMutate: async ({ id, active }) => {
      await qc.cancelQueries({ queryKey: TEACHERS_KEY });
      const prev = qc.getQueryData<Teacher[]>(TEACHERS_KEY);
      if (prev) {
        qc.setQueryData<Teacher[]>(
          TEACHERS_KEY,
          prev.map((t) => (t.teacherId === id ? { ...t, active } : t)),
        );
      }
      return { prev };
    },
    onError: (e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(TEACHERS_KEY, ctx.prev);
      toast.error(errMsg(e, "Failed to update status"));
    },
    onSuccess: (t) => {
      toast.success(`Teacher ${t.active ? "activated" : "deactivated"}`);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: TEACHERS_KEY }),
  });
}
