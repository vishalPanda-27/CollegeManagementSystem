export interface Subject {
  id: number;
  subjectCode: string;
  subjectName: string;
  credits: number;
  theoryHours: number;
  practicalHours?: number | null;
  semester: number;
  active: boolean;
  departmentId: number;
  departmentName?: string | null;
  courseId: number;
  courseName?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubjectRequest {
  subjectCode: string;
  subjectName: string;
  credits: number;
  theoryHours: number;
  practicalHours?: number | null;
  semester: number;
  active?: boolean;
  departmentId: number;
  courseId: number;
}
