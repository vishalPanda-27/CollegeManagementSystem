import { usersApi } from "@/api/users";
import { departmentsApi } from "@/api/departments";
import { studentApi } from "@/features/student/api/studentApi";
import { teacherApi } from "@/features/teacher/api/teacherApi";
import { courseApi } from "@/features/course/api/courseApi";
import { subjectApi } from "@/features/subject/api/subjectApi";
import { classroomApi } from "@/features/classroom/api/classroomApi";
import { timetableApi } from "@/features/timetable/api/timetableApi";
import { enrollmentApi } from "@/features/enrollment/api/enrollmentApi";
import { attendanceApi } from "@/features/attendance/api/attendanceApi";
import { resultApi } from "@/features/results/api/resultApi";
import type {
  AdminDashboardData,
  DeanDashboardData,
  TeacherDashboardData,
  StudentDashboardData,
} from "../types/dashboard";
import { dayOfWeekFromDate } from "../utils/dashboardHelpers";

const safe = <T,>(p: Promise<T>, fallback: T): Promise<T> =>
  p.catch(() => fallback);

export const dashboardApi = {
  async admin(): Promise<AdminDashboardData> {
    const [
      users,
      departments,
      students,
      teachers,
      courses,
      subjects,
      classrooms,
      timetables,
      enrollments,
      attendance,
      results,
    ] = await Promise.all([
      safe(usersApi.list(), []),
      safe(departmentsApi.list(), []),
      safe(studentApi.list(), []),
      safe(teacherApi.list(), []),
      safe(courseApi.list(), []),
      safe(subjectApi.list(), []),
      safe(classroomApi.list(), []),
      safe(timetableApi.list(), []),
      safe(enrollmentApi.list(), []),
      safe(attendanceApi.list(), []),
      safe(resultApi.list(), []),
    ]);
    return {
      kpis: {
        users: users.length,
        departments: departments.length,
        teachers: teachers.length,
        students: students.length,
        courses: courses.length,
        subjects: subjects.length,
        classrooms: classrooms.length,
        timetables: timetables.length,
      },
      users,
      students,
      teachers,
      courses,
      subjects,
      classrooms,
      timetables,
      departments,
      enrollments,
      attendance,
      results,
    };
  },

  async dean(email: string): Promise<DeanDashboardData> {
    const [departments, teachers, students, subjects, courses, classrooms, timetables] =
      await Promise.all([
        safe(departmentsApi.list(), []),
        safe(teacherApi.list(), []),
        safe(studentApi.list(), []),
        safe(subjectApi.list(), []),
        safe(courseApi.list(), []),
        safe(classroomApi.list(), []),
        safe(timetableApi.list(), []),
      ]);
    // Match dean's department via teacher email or department email/HOD name.
    const teacher = teachers.find((t) => t.email?.toLowerCase() === email.toLowerCase());
    const department =
      (teacher && departments.find((d) => d.id === teacher.departmentId)) ||
      departments.find((d) => d.email?.toLowerCase() === email.toLowerCase()) ||
      departments[0] ||
      null;

    const deptId = department?.id ?? -1;
    const deptTeachers = teachers.filter((t) => t.departmentId === deptId);
    const deptStudents = students.filter((s) => s.departmentId === deptId);
    const deptSubjects = subjects.filter((s) => s.departmentId === deptId);
    const deptCourses = courses.filter((c) => c.departmentId === deptId);
    const deptClassrooms = classrooms.filter((c) => c.departmentId === deptId);
    const deptSubjectIds = new Set(deptSubjects.map((s) => s.id));
    const deptStudentIds = new Set(deptStudents.map((s) => s.id));

    const [allAttendance, allResults] = await Promise.all([
      safe(attendanceApi.list(), []),
      safe(resultApi.list(), []),
    ]);
    const attendance = allAttendance.filter(
      (a) => deptSubjectIds.has(a.subjectId) || deptStudentIds.has(a.studentId),
    );
    const results = allResults.filter(
      (r) => deptSubjectIds.has(r.subjectId) || deptStudentIds.has(r.studentId),
    );
    const deptTeacherIds = new Set(deptTeachers.map((t) => t.teacherId));
    const deptTimetables = timetables.filter((t) => deptTeacherIds.has(t.teacherId));

    return {
      department,
      teachers: deptTeachers,
      students: deptStudents,
      subjects: deptSubjects,
      courses: deptCourses,
      classrooms: deptClassrooms,
      attendance,
      results,
      timetables: deptTimetables,
    };
  },

  async teacher(email: string): Promise<TeacherDashboardData> {
    const [teachers, subjects] = await Promise.all([
      safe(teacherApi.list(), []),
      safe(subjectApi.list(), []),
    ]);
    const teacher =
      teachers.find((t) => t.email?.toLowerCase() === email.toLowerCase()) ?? null;
    if (!teacher) {
      return {
        teacher: null,
        subjects: [],
        timetables: [],
        todayTimetables: [],
        attendance: [],
        results: [],
      };
    }
    const teacherSubjectIds = new Set(teacher.subjectIds ?? []);
    const teacherSubjects = subjects.filter((s) => teacherSubjectIds.has(s.id));
    const today = dayOfWeekFromDate(new Date());

    const [timetables, todayTimetables, attendance, allResults] = await Promise.all([
      safe(timetableApi.listByTeacher(teacher.teacherId), []),
      safe(
        timetableApi
          .listByTeacher(teacher.teacherId)
          .then((all) => all.filter((t) => t.dayOfWeek === today)),
        [],
      ),
      safe(attendanceApi.listByTeacher(teacher.teacherId), []),
      safe(resultApi.list(), []),
    ]);
    const results = allResults.filter((r) => teacherSubjectIds.has(r.subjectId));
    return {
      teacher,
      subjects: teacherSubjects,
      timetables,
      todayTimetables,
      attendance,
      results,
    };
  },

  async student(email: string): Promise<StudentDashboardData> {
    const students = await safe(studentApi.list(), []);
    const student =
      students.find((s) => s.email?.toLowerCase() === email.toLowerCase()) ?? null;
    if (!student) {
      return {
        student: null,
        enrollments: [],
        activeEnrollments: [],
        results: [],
        attendance: [],
        timetables: [],
        percentage: 0,
        cgpa: 0,
        attendancePercentage: 0,
      };
    }
    const [enrollments, activeEnrollments, results, attendance, percentage, cgpa] =
      await Promise.all([
        safe(enrollmentApi.listByStudent(student.id), []),
        safe(enrollmentApi.listActiveByStudent(student.id), []),
        safe(resultApi.listByStudent(student.id), []),
        safe(attendanceApi.listByStudent(student.id), []),
        safe(resultApi.studentPercentage(student.id), 0),
        safe(resultApi.studentCgpa(student.id), 0),
      ]);
    // Timetables inferred from enrolled courses.
    const courseIds = Array.from(new Set(enrollments.map((e) => e.courseId)));
    const timetableLists = await Promise.all(
      courseIds.map((cid) => safe(timetableApi.listByCourse(cid), [])),
    );
    const timetables = timetableLists.flat();

    const present = attendance.filter(
      (a) => a.status === "PRESENT" || a.status === "LATE",
    ).length;
    const attendancePercentage = attendance.length
      ? (present / attendance.length) * 100
      : 0;

    return {
      student,
      enrollments,
      activeEnrollments,
      results,
      attendance,
      timetables,
      percentage,
      cgpa,
      attendancePercentage,
    };
  },
};
