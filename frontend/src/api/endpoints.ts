import apiClient from "./client";
import type {
  Student,
  Teacher,
  Course,
  Department,
  LoginPayload,
  LoginResponse,
  User,
} from "@/types";

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient
      .post<LoginResponse>("/auth/login", payload)
      .then((r) => r.data),

  register: (data: {
    username: string;
    email: string;
    password: string;
    role: string;
  }) =>
    apiClient
      .post("/auth/register", data)
      .then((r) => r.data),

  refresh: (refreshToken: string) =>
    apiClient
      .post("/auth/refresh", { refreshToken })
      .then((r) => r.data),

  me: () =>
    apiClient
      .get<User>("/auth/me")
      .then((r) => r.data),

  logout: () =>
    apiClient
      .post("/auth/logout")
      .then((r) => r.data),
};

const crud = <T>(resource: string) => ({
  list: () =>
    apiClient
      .get<T[]>(`/${resource}`)
      .then((r) => r.data),

  get: (id: string | number) =>
    apiClient
      .get<T>(`/${resource}/${id}`)
      .then((r) => r.data),

  create: (data: Partial<T>) =>
    apiClient
      .post<T>(`/${resource}`, data)
      .then((r) => r.data),

  update: (id: string | number, data: Partial<T>) =>
    apiClient
      .put<T>(`/${resource}/${id}`, data)
      .then((r) => r.data),

  remove: (id: string | number) =>
    apiClient
      .delete(`/${resource}/${id}`)
      .then((r) => r.data),
});

export const studentsApi = crud<Student>("students");
export const teachersApi = crud<Teacher>("teachers");
export const coursesApi = crud<Course>("courses");
export const departmentsApi = crud<Department>("departments");