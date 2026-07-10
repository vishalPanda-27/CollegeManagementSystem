import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { subjectApi } from "../api/subjectApi";
import type { Subject, SubjectRequest } from "../types";

export const SUBJECTS_KEY = ["subjects"] as const;

function errMsg(e: unknown, fallback: string): string {
  const anyE = e as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  return anyE?.response?.data?.message ?? anyE?.message ?? fallback;
}

export function useSubjects() {
  return useQuery({ queryKey: SUBJECTS_KEY, queryFn: subjectApi.list });
}

export function useSubject(id: number | string | null | undefined) {
  return useQuery({
    queryKey: ["subjects", id],
    queryFn: () => subjectApi.get(id as number),
    enabled: id !== null && id !== undefined,
  });
}

export function useCreateSubject(onDone?: (s: Subject) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SubjectRequest) => subjectApi.create(data),
    onSuccess: (s) => {
      qc.invalidateQueries({ queryKey: SUBJECTS_KEY });
      toast.success("Subject created");
      onDone?.(s);
    },
    onError: (e) => toast.error(errMsg(e, "Failed to create subject")),
  });
}

export function useUpdateSubject(onDone?: (s: Subject) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SubjectRequest }) =>
      subjectApi.update(id, data),
    onSuccess: (s) => {
      qc.invalidateQueries({ queryKey: SUBJECTS_KEY });
      qc.invalidateQueries({ queryKey: ["subjects", s.id] });
      toast.success("Subject updated");
      onDone?.(s);
    },
    onError: (e) => toast.error(errMsg(e, "Failed to update subject")),
  });
}

export function useDeleteSubject(onDone?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => subjectApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SUBJECTS_KEY });
      toast.success("Subject deleted");
      onDone?.();
    },
    onError: (e) => toast.error(errMsg(e, "Failed to delete subject")),
  });
}
