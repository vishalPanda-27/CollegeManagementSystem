import {
  Users,
  Building2,
  GraduationCap,
  BookOpen,
  Library,
  DoorOpen,
  CalendarClock,
  UserPlus,
  ClipboardList,
  ClipboardCheck,
  Award,
  Settings,
} from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardGrid, DashboardSection } from "../components/DashboardGrid";
import { StatsCard } from "../components/StatsCard";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { BarChartCard, PieChartCard } from "../components/ChartCard";
import { QuickActions } from "../components/QuickActionCard";
import { RecentActivityCard } from "../components/RecentActivityCard";
import { groupCount } from "../utils/chartHelpers";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useAdminDashboard();

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !data)
    return <ErrorState onRetry={() => refetch()} />;

  const {
    kpis,
    students,
    teachers,
    courses,
    departments,
    enrollments,
    attendance,
    results,
    classrooms,
    users,
  } = data;

  const deptName = (id: number) =>
    departments.find((d) => d.id === id)?.name ?? "Unknown";

  const studentsByDept = groupCount(students, (s) => deptName(s.departmentId));
  const teachersByDept = groupCount(teachers, (t) => deptName(t.departmentId));
  const enrollmentStatus = groupCount(enrollments, (e) => e.status);
  const attendanceOverview = groupCount(attendance, (a) => a.status);
  const resultStatus = groupCount(results, (r) => r.status);
  const studentStatus = groupCount(students, (s) => s.status);
  const classroomStatus = groupCount(classrooms, (c) => c.status);
  const userRoles = groupCount(users, (u) => u.role);

  const recentStudents = [...students]
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
    .slice(0, 5)
    .map((s) => ({
      key: s.id,
      primary: `${s.firstName} ${s.lastName}`,
      secondary: `${s.rollNumber} · ${s.departmentName ?? ""}`,
      meta: s.status,
      to: `/students`,
    }));
  const recentTeachers = [...teachers]
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
    .slice(0, 5)
    .map((t) => ({
      key: t.teacherId,
      primary: `${t.firstName} ${t.lastName}`,
      secondary: `${t.specialization ?? ""} · ${t.departmentName ?? ""}`,
      meta: t.active ? "Active" : "Inactive",
      to: `/teachers`,
    }));
  const recentCourses = [...courses]
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
    .slice(0, 5)
    .map((c) => ({
      key: c.id,
      primary: c.courseName,
      secondary: `${c.courseCode} · ${c.departmentName ?? ""}`,
      meta: `${c.credits} cr`,
      to: `/courses`,
    }));

  return (
    <div>
      <DashboardHeader
        name={user?.name}
        role="ADMIN"
        subtitle="Institution-wide overview of your campus."
      />

      <DashboardGrid cols={4}>
        <StatsCard label="Total Users" value={kpis.users} icon={Users} tone="primary" />
        <StatsCard label="Departments" value={kpis.departments} icon={Building2} tone="info" />
        <StatsCard label="Teachers" value={kpis.teachers} icon={Users} tone="success" />
        <StatsCard label="Students" value={kpis.students} icon={GraduationCap} tone="primary" />
        <StatsCard label="Courses" value={kpis.courses} icon={BookOpen} tone="info" />
        <StatsCard label="Subjects" value={kpis.subjects} icon={Library} tone="warning" />
        <StatsCard label="Classrooms" value={kpis.classrooms} icon={DoorOpen} tone="success" />
        <StatsCard label="Timetable Entries" value={kpis.timetables} icon={CalendarClock} tone="primary" />
      </DashboardGrid>

      <DashboardSection title="Quick Actions">
        <QuickActions
          actions={[
            { label: "Add Student", to: "/students", icon: UserPlus, description: "Enroll a new student" },
            { label: "Add Teacher", to: "/teachers", icon: Users, description: "Add faculty member" },
            { label: "Add Course", to: "/courses", icon: BookOpen, description: "Create a course" },
            { label: "Create Timetable", to: "/timetable", icon: CalendarClock, description: "Schedule classes" },
            { label: "Record Attendance", to: "/attendance/mark", icon: ClipboardCheck, description: "Mark attendance" },
            { label: "Create Result", to: "/results", icon: Award, description: "Enter results" },
            { label: "Manage Users", to: "/users", icon: Settings, description: "Roles & access" },
            { label: "Enrollments", to: "/enrollments", icon: ClipboardList, description: "Student enrollments" },
          ]}
        />
      </DashboardSection>

      <DashboardSection title="Analytics">
        <div className="grid gap-4 lg:grid-cols-2">
          <BarChartCard title="Students by Department" data={studentsByDept} />
          <BarChartCard title="Teachers by Department" data={teachersByDept} color="#10b981" />
          <PieChartCard title="Enrollment Status" data={enrollmentStatus} />
          <PieChartCard title="Attendance Overview" data={attendanceOverview} />
          <PieChartCard title="Results Pass vs Fail" data={resultStatus} />
          <PieChartCard title="Student Status" data={studentStatus} />
          <PieChartCard title="Classroom Availability" data={classroomStatus} />
          <PieChartCard title="User Roles" data={userRoles} />
        </div>
      </DashboardSection>

      <DashboardSection title="Recently Added">
        <div className="grid gap-4 lg:grid-cols-3">
          <RecentActivityCard title="Recent Students" items={recentStudents} />
          <RecentActivityCard title="Recent Teachers" items={recentTeachers} />
          <RecentActivityCard title="Recent Courses" items={recentCourses} />
        </div>
      </DashboardSection>
    </div>
  );
}
