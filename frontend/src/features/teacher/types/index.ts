export interface Teacher {
  teacherId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  qualification: string;
  specialization: string;
  joiningDate: string;
  salary: number;
  active: boolean;
  departmentId: number;
  departmentName?: string | null;
  userId?: number | null;
  subjectIds?: number[];
  courseIds?: number[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TeacherRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  qualification: string;
  specialization: string;
  joiningDate?: string;
  salary: number;
  active: boolean;
  departmentId: number;
  userId?: number | null;
  subjectIds?: number[];
  courseIds?: number[];
}
