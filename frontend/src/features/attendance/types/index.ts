export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "LEAVE";

export const ATTENDANCE_STATUSES: AttendanceStatus[] = [
  "PRESENT",
  "ABSENT",
  "LATE",
  "LEAVE",
];

export const ATTENDANCE_STATUS_LABEL: Record<AttendanceStatus, string> = {
  PRESENT: "Present",
  ABSENT: "Absent",
  LATE: "Late",
  LEAVE: "Leave",
};

export interface Attendance {
  attendanceId: number;
  studentId: number;
  studentName: string;
  subjectId: number;
  subjectName: string;
  markedById?: number | null;
  teacherName?: string | null;
  attendanceDate: string; // yyyy-MM-dd
  status: AttendanceStatus;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AttendanceRequest {
  studentId: number;
  subjectId: number;
  markedById?: number | null;
  attendanceDate: string;
  status: AttendanceStatus;
}
