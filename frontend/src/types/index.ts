export type Role =
  | "ADMIN"
  | "TEACHER"
  | "STUDENT"
  | "DEAN";

export interface UserRecord {
  id: number;
  username: string;
  email: string;
  role: Role;
  enabled: boolean;
  accountLocked: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserRequest {
  username: string;
  email: string;
  password?: string;
  role: Role;
  enabled?: boolean;
  accountLocked?: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  username: string;
  email: string;
  role: Role;
}

export interface Student {
  id: number;
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: string;
  departmentName?: string;
  year: number;
  gpa?: number;
  status: "ACTIVE" | "INACTIVE" | "GRADUATED" | "SUSPENDED";
}

export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: string;
  departmentName?: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  semester: number;
  credits: number;
  departmentId: string;
  departmentName?: string;
  teacherId?: string;
  teacherName?: string;
}

export interface Department {
  id: number;
  code: string;
  name: string;
  description?: string;
  email?: string;
  phoneNumber?: string;
  hodId?: number | null;
  hodName?: string | null;
  totalStudents?: number;
  totalTeachers?: number;
  totalCourses?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DepartmentRequest {
  code: string;
  name: string;
  description?: string;
  email?: string;
  phoneNumber: string;
}

export interface TeacherOption {
  id: number;
  firstName: string;
  lastName: string;
}