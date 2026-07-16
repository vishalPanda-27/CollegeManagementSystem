import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resultApi } from "../api/resultApi";
import type { Result, ResultRequest } from "../types";

export const RESULTS_KEY = ["results"] as const;

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

export function useResults() {
  return useQuery({ queryKey: RESULTS_KEY, queryFn: resultApi.list });
}

export function useResult(id: number | null | undefined) {
  return useQuery({
    queryKey: ["results", id],
    queryFn: () => resultApi.get(id as number),
    enabled: id != null,
  });
}

export function useResultsByStudent(id: number | null | undefined) {
  return useQuery({
    queryKey: ["results", "student", id],
    queryFn: () => resultApi.listByStudent(id as number),
    enabled: id != null,
  });
}

export function useResultsBySubject(id: number | null | undefined) {
  return useQuery({
    queryKey: ["results", "subject", id],
    queryFn: () => resultApi.listBySubject(id as number),
    enabled: id != null,
  });
}

export function useStudentPercentage(id: number | null | undefined) {
  return useQuery({
    queryKey: ["results", "student", id, "percentage"],
    queryFn: () => resultApi.studentPercentage(id as number),
    enabled: id != null,
  });
}

export function useStudentCgpa(id: number | null | undefined) {
  return useQuery({
    queryKey: ["results", "student", id, "cgpa"],
    queryFn: () => resultApi.studentCgpa(id as number),
    enabled: id != null,
    retry: false,
  });
}

export function useCreateResult(onDone?: (r: Result) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ResultRequest) => resultApi.create(data),
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: ["results"] });
      toast.success("Result saved");
      onDone?.(r);
    },
    onError: (e) => toast.error(errMsg(e, "Failed to save result")),
  });
}

export function useUpdateResult(onDone?: (r: Result) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ResultRequest }) =>
      resultApi.update(id, data),
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: ["results"] });
      toast.success("Result updated");
      onDone?.(r);
    },
    onError: (e) => toast.error(errMsg(e, "Failed to update result")),
  });
}

export function useDeleteResult(onDone?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => resultApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["results"] });
      toast.success("Result deleted");
      onDone?.();
    },
    onError: (e) => toast.error(errMsg(e, "Failed to delete result")),
  });
}
