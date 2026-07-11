import apiClient from "@/api/client";
import type { DayOfWeek, Timetable, TimetableRequest } from "../types";

export const timetableApi = {
  list: () => apiClient.get<Timetable[]>("/timetables").then((r) => r.data),
  get: (id: number | string) =>
    apiClient.get<Timetable>(`/timetables/${id}`).then((r) => r.data),
  listByCourse: (courseId: number | string) =>
    apiClient
      .get<Timetable[]>(`/timetables/course/${courseId}`)
      .then((r) => r.data),
  listByTeacher: (teacherId: number | string) =>
    apiClient
      .get<Timetable[]>(`/timetables/teacher/${teacherId}`)
      .then((r) => r.data),
  listByClassroom: (classroomId: number | string) =>
    apiClient
      .get<Timetable[]>(`/timetables/classroom/${classroomId}`)
      .then((r) => r.data),
  listByDay: (day: DayOfWeek) =>
    apiClient.get<Timetable[]>(`/timetables/day/${day}`).then((r) => r.data),
  count: () =>
    apiClient.get<number>("/timetables/strength").then((r) => r.data),
  countByTeacher: (id: number | string) =>
    apiClient
      .get<number>(`/timetables/teacher/${id}/strength`)
      .then((r) => r.data),
  countByCourse: (id: number | string) =>
    apiClient
      .get<number>(`/timetables/course/${id}/strength`)
      .then((r) => r.data),
  countByClassroom: (id: number | string) =>
    apiClient
      .get<number>(`/timetables/classroom/${id}/strength`)
      .then((r) => r.data),
  create: (data: TimetableRequest) =>
    apiClient.post<Timetable>("/timetables", data).then((r) => r.data),
  update: (id: number | string, data: TimetableRequest) =>
    apiClient.put<Timetable>(`/timetables/${id}`, data).then((r) => r.data),
  remove: (id: number | string) =>
    apiClient.delete(`/timetables/${id}`).then((r) => r.data),
};
