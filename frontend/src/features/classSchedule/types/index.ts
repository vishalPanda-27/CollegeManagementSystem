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

export interface ClassSchedule {
  scheduleId: number;
  teacherId: number;
  teacherName?: string | null;
  subjectId: number;
  subjectName?: string | null;
  classroomId: number;
  classroomName?: string | null;
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm[:ss]
  endTime: string;
  semester?: string | null;
  academicYear?: string | null;
}

export interface ClassScheduleRequest {
  teacherId: number;
  subjectId: number;
  classroomId: number;
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm[:ss]
  endTime: string;
  semester?: string;
  academicYear?: string;
}
