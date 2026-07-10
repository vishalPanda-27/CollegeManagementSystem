import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { programApi } from "../api/programApi";
import type { Program, ProgramRequest } from "../types";

export const PROGRAMS_KEY = ["programs"] as const;

function errMsg(e: unknown, fallback: string): string {
  const anyE = e as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  return anyE?.response?.data?.message ?? anyE?.message ?? fallback;
}

export function usePrograms() {
  return useQuery({ queryKey: PROGRAMS_KEY, queryFn: programApi.list });
}

export function useProgram(id: number | string | null | undefined) {
  return useQuery({
    queryKey: ["programs", id],
    queryFn: () => programApi.get(id as number),
    enabled: id !== null && id !== undefined,
  });
}

export function useCreateProgram(onDone?: (p: Program) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProgramRequest) => programApi.create(data),
    onSuccess: (p) => {
      qc.invalidateQueries({ queryKey: PROGRAMS_KEY });
      toast.success("Program created");
      onDone?.(p);
    },
    onError: (e) => toast.error(errMsg(e, "Failed to create program")),
  });
}

export function useUpdateProgram(onDone?: (p: Program) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProgramRequest }) =>
      programApi.update(id, data),
    onSuccess: (p) => {
      qc.invalidateQueries({ queryKey: PROGRAMS_KEY });
      qc.invalidateQueries({ queryKey: ["programs", p.programId] });
      toast.success("Program updated");
      onDone?.(p);
    },
    onError: (e) => toast.error(errMsg(e, "Failed to update program")),
  });
}

export function useDeleteProgram(onDone?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => programApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROGRAMS_KEY });
      toast.success("Program deleted");
      onDone?.();
    },
    onError: (e) => toast.error(errMsg(e, "Failed to delete program")),
  });
}
