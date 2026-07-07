import apiClient from "./client";
import type { UserRecord, UserRequest, Role } from "@/types";

export const usersApi = {
  list: () => apiClient.get<UserRecord[]>("/users").then((r) => r.data),
  get: (id: number | string) =>
    apiClient.get<UserRecord>(`/users/${id}`).then((r) => r.data),
  byRole: (role: Role) =>
    apiClient.get<UserRecord[]>(`/users/role/${role}`).then((r) => r.data),
  enabled: () =>
    apiClient.get<UserRecord[]>("/users/enabled").then((r) => r.data),
  disabled: () =>
    apiClient.get<UserRecord[]>("/users/disabled").then((r) => r.data),
  strength: () => apiClient.get<number>("/users/strength").then((r) => r.data),
  strengthByRole: (role: Role) =>
    apiClient.get<number>(`/users/role/${role}/strength`).then((r) => r.data),
  enabledStrength: () =>
    apiClient.get<number>("/users/enabled/strength").then((r) => r.data),

  create: (data: UserRequest) =>
    apiClient.post<UserRecord>("/users", data).then((r) => r.data),
  update: (id: number | string, data: UserRequest) =>
    apiClient.put<UserRecord>(`/users/${id}`, data).then((r) => r.data),
  remove: (id: number | string) =>
    apiClient.delete(`/users/${id}`).then((r) => r.data),

  enable: (id: number | string) =>
    apiClient.patch<UserRecord>(`/users/${id}/enable`).then((r) => r.data),
  disable: (id: number | string) =>
    apiClient.patch<UserRecord>(`/users/${id}/disable`).then((r) => r.data),
  lock: (id: number | string) =>
    apiClient.patch<UserRecord>(`/users/${id}/lock`).then((r) => r.data),
  unlock: (id: number | string) =>
    apiClient.patch<UserRecord>(`/users/${id}/unlock`).then((r) => r.data),
};
