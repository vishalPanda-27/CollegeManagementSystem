import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "./dashboardApi";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  admin: ["dashboard", "admin"] as const,
  dean: (email: string) => ["dashboard", "dean", email] as const,
  teacher: (email: string) => ["dashboard", "teacher", email] as const,
  student: (email: string) => ["dashboard", "student", email] as const,
};

const STALE = 60_000;

export const useAdminDashboardQuery = () =>
  useQuery({
    queryKey: dashboardKeys.admin,
    queryFn: () => dashboardApi.admin(),
    staleTime: STALE,
  });

export const useDeanDashboardQuery = (email: string | undefined) =>
  useQuery({
    queryKey: dashboardKeys.dean(email ?? ""),
    queryFn: () => dashboardApi.dean(email!),
    staleTime: STALE,
    enabled: !!email,
  });

export const useTeacherDashboardQuery = (email: string | undefined) =>
  useQuery({
    queryKey: dashboardKeys.teacher(email ?? ""),
    queryFn: () => dashboardApi.teacher(email!),
    staleTime: STALE,
    enabled: !!email,
  });

export const useStudentDashboardQuery = (email: string | undefined) =>
  useQuery({
    queryKey: dashboardKeys.student(email ?? ""),
    queryFn: () => dashboardApi.student(email!),
    staleTime: STALE,
    enabled: !!email,
  });
