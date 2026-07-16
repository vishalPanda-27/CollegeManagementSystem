import {
  BookOpen,
  Library,
  ClipboardCheck,
  Award,
  CalendarClock,
  GraduationCap,
} from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardGrid, DashboardSection } from "../components/DashboardGrid";
import { StatsCard } from "../components/StatsCard";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { DashboardEmptyState } from "../components/DashboardEmptyState";
import { ProgressCard } from "../components/ProgressCard";
import { useStudentDashboard } from "../hooks/useStudentDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { AnalyticsCard } from "../components/AnalyticsCard";
import { BarChartCard, LineChartCard, PieChartCard } from "../components/ChartCard";
import { QuickActions } from "../components/QuickActionCard";
import { groupCount } from "../utils/chartHelpers";
import {
  dayOfWeekFromDate,
  formatTime,
  sortByTime,
} from "../utils/dashboardHelpers";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useStudentDashboard();

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  const {
    student,
    enrollments,
    activeEnrollments,
    results,
    timetables,
    percentage,
    cgpa,
    attendancePercentage,
  } = data;

  if (!student) {
    return (
      <div>
        <DashboardHeader name={user?.name} role="STUDENT" />
        <DashboardEmptyState message="No student profile linked to your account. Contact administration." />
      </div>
    );
  }

  const subjectMarks = results.map((r) => ({
    name: r.subjectName,
    value: Number(r.percentage?.toFixed(2) ?? 0),
  }));
  const gradeDistribution = groupCount(results, (r) => r.grade || "—");
  const semesterPerf = Object.entries(
    results.reduce<Record<string, { sum: number; count: number }>>((acc, r) => {
      const key = "All";
      acc[key] = acc[key] ?? { sum: 0, count: 0 };
      acc[key].sum += r.percentage ?? 0;
      acc[key].count += 1;
      return acc;
    }, {}),
  ).map(([k, v]) => ({ name: k, value: Number((v.sum / v.count).toFixed(2)) }));

  const today = dayOfWeekFromDate(new Date());
  const upcoming = [...timetables]
    .filter((t) => t.dayOfWeek === today)
    .sort(sortByTime);

  return (
    <div>
      <DashboardHeader
        name={`${student.firstName} ${student.lastName}`}
        role="STUDENT"
        subtitle={`${student.rollNumber}${student.departmentName ? " · " + student.departmentName : ""}`}
      />

      <DashboardGrid cols={4}>
        <StatsCard label="Enrolled Courses" value={activeEnrollments.length} icon={BookOpen} tone="primary" />
        <StatsCard label="Total Enrollments" value={enrollments.length} icon={Library} tone="info" />
        <StatsCard label="Results Available" value={results.length} icon={Award} tone="warning" />
        <StatsCard label="Upcoming Today" value={upcoming.length} icon={CalendarClock} tone="success" />
      </DashboardGrid>

      <DashboardSection title="Performance">
        <div className="grid gap-4 sm:grid-cols-3">
          <ProgressCard label="Attendance" value={attendancePercentage} />
          <ProgressCard label="Overall %" value={percentage} />
          <ProgressCard label="CGPA" value={cgpa} max={10} suffix="/10" />
        </div>
      </DashboardSection>

      <DashboardSection title="Quick Actions">
        <QuickActions
          actions={[
            { label: "View Transcript", to: "/results/transcript", icon: Award },
            { label: "My Timetable", to: "/timetable", icon: CalendarClock },
            { label: "My Attendance", to: "/attendance", icon: ClipboardCheck },
            { label: "My Courses", to: "/enrollments/students", icon: BookOpen },
            { label: "My Results", to: "/results", icon: GraduationCap },
          ]}
        />
      </DashboardSection>

      <DashboardSection title="Today's Schedule">
        <AnalyticsCard title="Classes today" description={today}>
          {upcoming.length === 0 ? (
            <DashboardEmptyState message="No classes scheduled today." />
          ) : (
            <ul className="divide-y">
              {upcoming.map((t) => (
                <li key={t.timetableId} className="flex items-center gap-3 py-3">
                  <div className="w-24 shrink-0 text-sm font-semibold tabular-nums">
                    {formatTime(t.startTime)}–{formatTime(t.endTime)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {t.subjectName}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {t.classroomName} · {t.teacherName ?? ""}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AnalyticsCard>
      </DashboardSection>

      <DashboardSection title="Analytics">
        <div className="grid gap-4 lg:grid-cols-2">
          <BarChartCard title="Subject-wise Marks (%)" data={subjectMarks} />
          <PieChartCard title="Grade Distribution" data={gradeDistribution} />
          <LineChartCard
            title="Semester Performance"
            data={semesterPerf}
            color="#10b981"
          />
        </div>
      </DashboardSection>
    </div>
  );
}
