import {
  Users,
  GraduationCap,
  Library,
  BookOpen,
  DoorOpen,
  Building2,
  ClipboardCheck,
  Award,
} from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardGrid, DashboardSection } from "../components/DashboardGrid";
import { StatsCard } from "../components/StatsCard";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { useDeanDashboard } from "../hooks/useDeanDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { BarChartCard, PieChartCard } from "../components/ChartCard";
import { QuickActions } from "../components/QuickActionCard";
import { groupCount } from "../utils/chartHelpers";

export default function DeanDashboard() {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useDeanDashboard();

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  const { department, teachers, students, subjects, courses, classrooms, attendance, results } =
    data;

  const attendanceOverview = groupCount(attendance, (a) => a.status);
  const resultStatus = groupCount(results, (r) => r.status);
  const studentStatus = groupCount(students, (s) => s.status);
  const teacherWorkload = teachers
    .map((t) => ({
      name: `${t.firstName} ${t.lastName}`,
      value: (t.subjectIds?.length ?? 0) + (t.courseIds?.length ?? 0),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return (
    <div>
      <DashboardHeader
        name={user?.name}
        role="DEAN"
        subtitle={
          department
            ? `${department.name} · ${department.code}`
            : "Department overview"
        }
      />

      <DashboardGrid cols={4}>
        <StatsCard
          label="Department"
          value={department?.code ?? "—"}
          icon={Building2}
          tone="primary"
          hint={department?.name}
        />
        <StatsCard label="Teachers" value={teachers.length} icon={Users} tone="success" />
        <StatsCard label="Students" value={students.length} icon={GraduationCap} tone="info" />
        <StatsCard label="Subjects" value={subjects.length} icon={Library} tone="warning" />
        <StatsCard label="Courses" value={courses.length} icon={BookOpen} tone="primary" />
        <StatsCard label="Classrooms" value={classrooms.length} icon={DoorOpen} tone="info" />
      </DashboardGrid>

      <DashboardSection title="Quick Actions">
        <QuickActions
          actions={[
            { label: "Manage Teachers", to: "/teachers", icon: Users },
            { label: "Manage Students", to: "/students", icon: GraduationCap },
            { label: "View Results", to: "/results", icon: Award },
            { label: "View Attendance", to: "/attendance", icon: ClipboardCheck },
            { label: "Manage Courses", to: "/courses", icon: BookOpen },
            { label: "Manage Subjects", to: "/subjects", icon: Library },
          ]}
        />
      </DashboardSection>

      <DashboardSection title="Analytics">
        <div className="grid gap-4 lg:grid-cols-2">
          <PieChartCard title="Department Attendance" data={attendanceOverview} />
          <PieChartCard title="Department Results" data={resultStatus} />
          <BarChartCard
            title="Teacher Workload (subjects + courses)"
            data={teacherWorkload}
            color="#8b5cf6"
          />
          <PieChartCard title="Student Status" data={studentStatus} />
        </div>
      </DashboardSection>
    </div>
  );
}
