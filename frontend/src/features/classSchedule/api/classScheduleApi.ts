import apiClient from "@/api/client";
import type {
  ClassSchedule,
  ClassScheduleRequest,
  DayOfWeek,
} from "../types";

export const classScheduleApi = {
  list: () =>
    apiClient.get<ClassSchedule[]>("/schedules").then((r) => r.data),
  get: (id: number | string) =>
    apiClient.get<ClassSchedule>(`/schedules/${id}`).then((r) => r.data),
  listByDay: (day: DayOfWeek) =>
    apiClient
      .get<ClassSchedule[]>(`/schedules/day/${day}`)
      .then((r) => r.data),
  listByClassroom: (classroomId: number | string) =>
    apiClient
      .get<ClassSchedule[]>(`/schedules/classroom/${classroomId}`)
      .then((r) => r.data),
  listByTeacher: (teacherId: number | string) =>
    apiClient
      .get<ClassSchedule[]>(`/schedules/teacher/${teacherId}`)
      .then((r) => r.data),
  create: (data: ClassScheduleRequest) =>
    apiClient.post<ClassSchedule>("/schedules", data).then((r) => r.data),
  update: (id: number | string, data: ClassScheduleRequest) =>
    apiClient
      .put<ClassSchedule>(`/schedules/${id}`, data)
      .then((r) => r.data),
  remove: (id: number | string) =>
    apiClient.delete(`/schedules/${id}`).then((r) => r.data),
};
