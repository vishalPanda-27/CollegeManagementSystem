import apiClient from "@/api/client";
import type { Subject, SubjectRequest } from "../types";

export const subjectApi = {
  list: () => apiClient.get<Subject[]>("/subjects").then((r) => r.data),
  get: (id: number | string) =>
    apiClient.get<Subject>(`/subjects/${id}`).then((r) => r.data),
  listByDepartment: (departmentId: number | string) =>
    apiClient
      .get<Subject[]>(`/subjects/department/${departmentId}`)
      .then((r) => r.data),
  listByCourse: (courseId: number | string) =>
    apiClient.get<Subject[]>(`/subjects/course/${courseId}`).then((r) => r.data),
  count: () => apiClient.get<number>("/subjects/strength").then((r) => r.data),
  countByDepartment: (departmentId: number | string) =>
    apiClient
      .get<number>(`/subjects/department/${departmentId}/strength`)
      .then((r) => r.data),
  countActive: () =>
    apiClient.get<number>("/subjects/active/strength").then((r) => r.data),
  countInactive: () =>
    apiClient.get<number>("/subjects/inactive/strength").then((r) => r.data),
  listActive: () =>
    apiClient.get<Subject[]>("/subjects/active").then((r) => r.data),
  listInactive: () =>
    apiClient.get<Subject[]>("/subjects/inactive").then((r) => r.data),
  create: (data: SubjectRequest) =>
    apiClient.post<Subject>("/subjects", data).then((r) => r.data),
  update: (id: number | string, data: SubjectRequest) =>
    apiClient.put<Subject>(`/subjects/${id}`, data).then((r) => r.data),
  activate: (id: number | string) =>
    apiClient.patch<Subject>(`/subjects/${id}/activate`).then((r) => r.data),
  deactivate: (id: number | string) =>
    apiClient.patch<Subject>(`/subjects/${id}/deactivate`).then((r) => r.data),
  remove: (id: number | string) =>
    apiClient.delete(`/subjects/${id}`).then((r) => r.data),
};
