import apiClient from "@/api/client";
import type { Classroom, ClassroomRequest, RoomStatus } from "../types";

export const classroomApi = {
  list: () => apiClient.get<Classroom[]>("/classrooms").then((r) => r.data),
  get: (id: number | string) =>
    apiClient.get<Classroom>(`/classrooms/${id}`).then((r) => r.data),
  listAvailable: () =>
    apiClient.get<Classroom[]>("/classrooms/available").then((r) => r.data),
  listByDepartment: (departmentId: number | string) =>
    apiClient
      .get<Classroom[]>(`/classrooms/department/${departmentId}`)
      .then((r) => r.data),
  listByBuilding: (buildingName: string) =>
    apiClient
      .get<Classroom[]>(`/classrooms/building/${encodeURIComponent(buildingName)}`)
      .then((r) => r.data),
  create: (data: ClassroomRequest) =>
    apiClient.post<Classroom>("/classrooms", data).then((r) => r.data),
  update: (id: number | string, data: ClassroomRequest) =>
    apiClient.put<Classroom>(`/classrooms/${id}`, data).then((r) => r.data),
  changeStatus: (id: number | string, status: RoomStatus) =>
    apiClient
      .patch<Classroom>(`/classrooms/${id}/status`, null, { params: { status } })
      .then((r) => r.data),
  remove: (id: number | string) =>
    apiClient.delete(`/classrooms/${id}`).then((r) => r.data),
};
