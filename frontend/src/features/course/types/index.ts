export interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  credits: number;
  semester: number;
  description?: string | null;
  departmentId: number;
  departmentName?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseRequest {
  courseCode: string;
  courseName: string;
  credits: number;
  semester: number;
  description?: string;
  departmentId: number;
}
