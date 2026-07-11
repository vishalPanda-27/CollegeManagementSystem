import apiClient from "@/api/client";
import type { Teacher, TeacherRequest } from "../types";

export const teacherApi = {
  list: () => apiClient.get<Teacher[]>("/teachers").then((r) => r.data),
  get: (id: number | string) =>
    apiClient.get<Teacher>(`/teachers/${id}`).then((r) => r.data),
  listByDepartment: (departmentId: number | string) =>
    apiClient
      .get<Teacher[]>(`/teachers/department/${departmentId}`)
      .then((r) => r.data),
  listActive: () =>
    apiClient.get<Teacher[]>("/teachers/active").then((r) => r.data),
  listInactive: () =>
    apiClient.get<Teacher[]>("/teachers/inactive").then((r) => r.data),
  count: () => apiClient.get<number>("/teachers/strength").then((r) => r.data),
  countByDepartment: (departmentId: number | string) =>
    apiClient
      .get<number>(`/teachers/department/${departmentId}/strength`)
      .then((r) => r.data),
  countActive: () =>
    apiClient.get<number>("/teachers/active/strength").then((r) => r.data),
  countInactive: () =>
    apiClient.get<number>("/teachers/inactive/strength").then((r) => r.data),
  create: (data: TeacherRequest) =>
    apiClient.post<Teacher>("/teachers", data).then((r) => r.data),
  update: (id: number | string, data: TeacherRequest) =>
    apiClient.put<Teacher>(`/teachers/${id}`, data).then((r) => r.data),
  activate: (id: number | string) =>
    apiClient.patch<Teacher>(`/teachers/${id}/activate`).then((r) => r.data),
  deactivate: (id: number | string) =>
    apiClient.patch<Teacher>(`/teachers/${id}/deactivate`).then((r) => r.data),
  remove: (id: number | string) =>
    apiClient.delete(`/teachers/${id}`).then((r) => r.data),
};
