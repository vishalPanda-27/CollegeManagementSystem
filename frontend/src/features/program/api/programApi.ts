import apiClient from "@/api/client";
import type { Program, ProgramRequest } from "../types";

export const programApi = {
  list: () => apiClient.get<Program[]>("/programs").then((r) => r.data),
  get: (id: number | string) =>
    apiClient.get<Program>(`/programs/${id}`).then((r) => r.data),
  listByDepartment: (departmentId: number | string) =>
    apiClient
      .get<Program[]>(`/programs/department/${departmentId}`)
      .then((r) => r.data),
  create: (data: ProgramRequest) =>
    apiClient.post<Program>("/programs", data).then((r) => r.data),
  update: (id: number | string, data: ProgramRequest) =>
    apiClient.put<Program>(`/programs/${id}`, data).then((r) => r.data),
  remove: (id: number | string) =>
    apiClient.delete(`/programs/${id}`).then((r) => r.data),
};
