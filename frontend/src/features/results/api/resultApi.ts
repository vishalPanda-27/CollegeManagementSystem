import apiClient from "@/api/client";
import type { Result, ResultRequest } from "../types";

export const resultApi = {
  list: () => apiClient.get<Result[]>("/results").then((r) => r.data),
  get: (id: number | string) =>
    apiClient.get<Result>(`/results/${id}`).then((r) => r.data),
  listByStudent: (studentId: number | string) =>
    apiClient
      .get<Result[]>(`/results/student/${studentId}`)
      .then((r) => r.data),
  listBySubject: (subjectId: number | string) =>
    apiClient
      .get<Result[]>(`/results/subject/${subjectId}`)
      .then((r) => r.data),
  studentPercentage: (studentId: number | string) =>
    apiClient
      .get<number>(`/results/student/${studentId}/percentage`)
      .then((r) => r.data),
  studentCgpa: (studentId: number | string) =>
    apiClient
      .get<number>(`/results/student/${studentId}/cgpa`)
      .then((r) => r.data),
  create: (data: ResultRequest) =>
    apiClient.post<Result>("/results", data).then((r) => r.data),
  update: (id: number | string, data: ResultRequest) =>
    apiClient.put<Result>(`/results/${id}`, data).then((r) => r.data),
  remove: (id: number | string) =>
    apiClient.delete(`/results/${id}`).then((r) => r.data),
};
