import apiClient from "@/api/client";
import type { Attendance, AttendanceRequest } from "../types";

export const attendanceApi = {
  list: () => apiClient.get<Attendance[]>("/attendance").then((r) => r.data),
  get: (id: number | string) =>
    apiClient.get<Attendance>(`/attendance/${id}`).then((r) => r.data),
  listByStudent: (studentId: number | string) =>
    apiClient
      .get<Attendance[]>(`/attendance/student/${studentId}`)
      .then((r) => r.data),
  listBySubject: (subjectId: number | string) =>
    apiClient
      .get<Attendance[]>(`/attendance/subject/${subjectId}`)
      .then((r) => r.data),
  listByTeacher: (teacherId: number | string) =>
    apiClient
      .get<Attendance[]>(`/attendance/teacher/${teacherId}`)
      .then((r) => r.data),
  listByDate: (date: string) =>
    apiClient.get<Attendance[]>(`/attendance/date/${date}`).then((r) => r.data),
  create: (data: AttendanceRequest) =>
    apiClient.post<Attendance>("/attendance", data).then((r) => r.data),
  update: (id: number | string, data: AttendanceRequest) =>
    apiClient.put<Attendance>(`/attendance/${id}`, data).then((r) => r.data),
  remove: (id: number | string) =>
    apiClient.delete(`/attendance/${id}`).then((r) => r.data),
};
