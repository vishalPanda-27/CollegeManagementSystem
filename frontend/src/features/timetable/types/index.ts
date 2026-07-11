export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

export const DAY_SHORT: Record<DayOfWeek, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

export interface Timetable {
  timetableId: number;
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm or HH:mm:ss
  endTime: string;
  classroomId: number;
  classroomName?: string | null;
  courseId: number;
  courseName?: string | null;
  subjectId: number;
  subjectName?: string | null;
  teacherId: number;
  teacherName?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface TimetableRequest {
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:mm" or "HH:mm:ss"
  endTime: string;
  classroomId: number;
  courseId: number;
  subjectId: number;
  teacherId: number;
}
