import apiClient from "./client";
import type { Department, DepartmentRequest } from "@/types";

export const departmentsApi = {
    list: () => apiClient.get<Department[]>("/departments").then((r) => r.data),
    get: (id: number | string) =>
        apiClient.get<Department>(`/departments/${id}`).then((r) => r.data),
    create: (data: DepartmentRequest) =>
        apiClient.post<Department>("/departments", data).then((r) => r.data),
    update: (id: number | string, data: DepartmentRequest) =>
        apiClient.put<Department>(`/departments/${id}`, data).then((r) => r.data),
    remove: (id: number | string) =>
        apiClient.delete(`/departments/${id}`).then((r) => r.data),
    assignHod: (departmentId: number | string, teacherId: number | string) =>
        apiClient
            .post<Department>(`/departments/${departmentId}/assign-hod/${teacherId}`)
            .then((r) => r.data),
};
