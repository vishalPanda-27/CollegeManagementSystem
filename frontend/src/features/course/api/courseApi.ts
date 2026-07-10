import apiClient from "@/api/client";
import type { Course, CourseRequest } from "../types";

export const courseApi = {
  list: () => apiClient.get<Course[]>("/courses").then((r) => r.data),
  get: (id: number | string) =>
    apiClient.get<Course>(`/courses/${id}`).then((r) => r.data),
  listByDepartment: (departmentId: number | string) =>
    apiClient
      .get<Course[]>(`/courses/department/${departmentId}`)
      .then((r) => r.data),
  listBySemester: (semester: number) =>
    apiClient.get<Course[]>(`/courses/semester/${semester}`).then((r) => r.data),
  create: (data: CourseRequest) =>
    apiClient.post<Course>("/courses", data).then((r) => r.data),
  update: (id: number | string, data: CourseRequest) =>
    apiClient.put<Course>(`/courses/${id}`, data).then((r) => r.data),
  remove: (id: number | string) =>
    apiClient.delete(`/courses/${id}`).then((r) => r.data),
};
