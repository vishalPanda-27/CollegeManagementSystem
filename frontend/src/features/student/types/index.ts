export type StudentStatus = "ACTIVE" | "INACTIVE" | "GRADUATED" | "SUSPENDED";

export const STUDENT_STATUSES: StudentStatus[] = [
  "ACTIVE",
  "INACTIVE",
  "GRADUATED",
  "SUSPENDED",
];

export const STUDENT_STATUS_LABEL: Record<StudentStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  GRADUATED: "Graduated",
  SUSPENDED: "Suspended",
};

export interface Student {
  id: number;
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: string | null;
  gender: string;
  address?: string | null;
  admissionDate?: string | null;
  status: StudentStatus;
  departmentId: number;
  departmentName?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface StudentRequest {
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: string | null;
  gender: string;
  address?: string | null;
  admissionDate?: string | null;
  status?: StudentStatus;
  departmentId: number;
}
