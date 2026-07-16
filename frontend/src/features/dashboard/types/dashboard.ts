import type { Student } from "@/features/student/types";
import type { Teacher } from "@/features/teacher/types";
import type { Course } from "@/features/course/types";
import type { Subject } from "@/features/subject/types";
import type { Timetable } from "@/features/timetable/types";
import type { Enrollment } from "@/features/enrollment/types";
import type { Attendance } from "@/features/attendance/types";
import type { Result } from "@/features/results/types";
import type { Classroom } from "@/features/classroom/types";
import type { Department, UserRecord } from "@/types";

export interface AdminDashboardData {
  kpis: {
    users: number;
    departments: number;
    teachers: number;
    students: number;
    courses: number;
    subjects: number;
    classrooms: number;
    timetables: number;
  };
  users: UserRecord[];
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  subjects: Subject[];
  classrooms: Classroom[];
  timetables: Timetable[];
  departments: Department[];
  enrollments: Enrollment[];
  attendance: Attendance[];
  results: Result[];
}

export interface DeanDashboardData {
  department: Department | null;
  teachers: Teacher[];
  students: Student[];
  subjects: Subject[];
  courses: Course[];
  classrooms: Classroom[];
  attendance: Attendance[];
  results: Result[];
  timetables: Timetable[];
}

export interface TeacherDashboardData {
  teacher: Teacher | null;
  subjects: Subject[];
  timetables: Timetable[];
  todayTimetables: Timetable[];
  attendance: Attendance[];
  results: Result[];
}

export interface StudentDashboardData {
  student: Student | null;
  enrollments: Enrollment[];
  activeEnrollments: Enrollment[];
  results: Result[];
  attendance: Attendance[];
  timetables: Timetable[];
  percentage: number;
  cgpa: number;
  attendancePercentage: number;
}
