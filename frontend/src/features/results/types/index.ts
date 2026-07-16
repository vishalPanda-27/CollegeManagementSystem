export type ResultStatus = "PASS" | "FAIL";

export const RESULT_STATUSES: ResultStatus[] = ["PASS", "FAIL"];

export type Grade = "A+" | "A" | "B" | "C" | "D" | "F";

export const GRADES: Grade[] = ["A+", "A", "B", "C", "D", "F"];

export interface Result {
  resultId: number;
  studentId: number;
  studentName: string;
  subjectId: number;
  subjectName: string;
  marksObtained: number;
  maximumMarks: number;
  percentage: number;
  grade: string;
  status: ResultStatus;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ResultRequest {
  studentId: number;
  subjectId: number;
  marksObtained: number;
  maximumMarks: number;
}
