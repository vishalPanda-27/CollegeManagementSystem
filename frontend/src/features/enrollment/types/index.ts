export type EnrollmentStatus =
  | "ENROLLED"
  | "COMPLETED"
  | "DROPPED"
  | "WITHDRAWN";

export const ENROLLMENT_STATUSES: EnrollmentStatus[] = [
  "ENROLLED",
  "COMPLETED",
  "DROPPED",
  "WITHDRAWN",
];

export const ENROLLMENT_STATUS_LABEL: Record<EnrollmentStatus, string> = {
  ENROLLED: "Enrolled",
  COMPLETED: "Completed",
  DROPPED: "Dropped",
  WITHDRAWN: "Withdrawn",
};

export interface Enrollment {
  enrollmentId: number;
  studentId: number;
  studentName: string;
  courseId: number;
  courseName: string;
  enrollmentDate?: string | null;
  semester?: string | null;
  academicYear?: string | null;
  status: EnrollmentStatus;
  grade?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface EnrollmentRequest {
  studentId: number;
  courseId: number;
  enrollmentDate?: string | null;
  semester?: string | null;
  academicYear?: string | null;
  status?: EnrollmentStatus;
  grade?: number | null;
}
