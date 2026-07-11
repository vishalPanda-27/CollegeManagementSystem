import apiClient from "@/api/client";
import type { Student, StudentRequest, StudentStatus } from "../types";

export const studentApi = {
  list: () => apiClient.get<Student[]>("/students").then((r) => r.data),
  get: (id: number | string) =>
    apiClient.get<Student>(`/students/${id}`).then((r) => r.data),
  listByDepartment: (departmentId: number | string) =>
    apiClient
      .get<Student[]>(`/students/department/${departmentId}`)
      .then((r) => r.data),
  listByStatus: (status: StudentStatus) =>
    apiClient.get<Student[]>(`/students/status/${status}`).then((r) => r.data),
  count: () => apiClient.get<number>("/students/strength").then((r) => r.data),
  countByDepartment: (departmentId: number | string) =>
    apiClient
      .get<number>(`/students/department/${departmentId}/strength`)
      .then((r) => r.data),
  countByStatus: (status: StudentStatus) =>
    apiClient
      .get<number>(`/students/status/${status}/strength`)
      .then((r) => r.data),
  create: (data: StudentRequest) =>
    apiClient.post<Student>("/students", data).then((r) => r.data),
  update: (id: number | string, data: StudentRequest) =>
    apiClient.put<Student>(`/students/${id}`, data).then((r) => r.data),
  activate: (id: number | string) =>
    apiClient.patch<Student>(`/students/${id}/activate`).then((r) => r.data),
  deactivate: (id: number | string) =>
    apiClient.patch<Student>(`/students/${id}/deactivate`).then((r) => r.data),
  suspend: (id: number | string) =>
    apiClient.patch<Student>(`/students/${id}/suspend`).then((r) => r.data),
  graduate: (id: number | string) =>
    apiClient.patch<Student>(`/students/${id}/graduate`).then((r) => r.data),
  remove: (id: number | string) =>
    apiClient.delete(`/students/${id}`).then((r) => r.data),
};
