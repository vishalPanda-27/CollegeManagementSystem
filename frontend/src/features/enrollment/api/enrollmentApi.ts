import apiClient from "@/api/client";
import type { Enrollment, EnrollmentRequest, EnrollmentStatus } from "../types";

export const enrollmentApi = {
  list: () =>
    apiClient.get<Enrollment[]>("/enrollments").then((r) => r.data),
  get: (id: number | string) =>
    apiClient.get<Enrollment>(`/enrollments/${id}`).then((r) => r.data),
  listByStudent: (studentId: number | string) =>
    apiClient
      .get<Enrollment[]>(`/enrollments/student/${studentId}`)
      .then((r) => r.data),
  listByCourse: (courseId: number | string) =>
    apiClient
      .get<Enrollment[]>(`/enrollments/course/${courseId}`)
      .then((r) => r.data),
  listByStatus: (status: EnrollmentStatus) =>
    apiClient
      .get<Enrollment[]>(`/enrollments/status/${status}`)
      .then((r) => r.data),
  listActiveByStudent: (studentId: number | string) =>
    apiClient
      .get<Enrollment[]>(`/enrollments/student/${studentId}/active`)
      .then((r) => r.data),
  listCompletedByStudent: (studentId: number | string) =>
    apiClient
      .get<Enrollment[]>(`/enrollments/student/${studentId}/completed`)
      .then((r) => r.data),
  create: (data: EnrollmentRequest) =>
    apiClient.post<Enrollment>("/enrollments", data).then((r) => r.data),
  update: (id: number | string, data: EnrollmentRequest) =>
    apiClient.put<Enrollment>(`/enrollments/${id}`, data).then((r) => r.data),
  complete: (id: number | string) =>
    apiClient
      .patch<Enrollment>(`/enrollments/${id}/complete`)
      .then((r) => r.data),
  drop: (id: number | string) =>
    apiClient.patch<Enrollment>(`/enrollments/${id}/drop`).then((r) => r.data),
  remove: (id: number | string) =>
    apiClient.delete(`/enrollments/${id}`).then((r) => r.data),
};
