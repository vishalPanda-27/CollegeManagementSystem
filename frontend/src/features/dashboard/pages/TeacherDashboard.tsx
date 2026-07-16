import {
  CalendarClock,
  Library,
  ClipboardCheck,
  Award,
  Users,
  BookOpen,
} from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardGrid, DashboardSection } from "../components/DashboardGrid";
import { StatsCard } from "../components/StatsCard";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { DashboardEmptyState } from "../components/DashboardEmptyState";
import { useTeacherDashboard } from "../hooks/useTeacherDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { AnalyticsCard } from "../components/AnalyticsCard";
import { BarChartCard, PieChartCard } from "../components/ChartCard";
import { QuickActions } from "../components/QuickActionCard";
import { groupCount } from "../utils/chartHelpers";
import { formatTime, sortByTime } from "../utils/dashboardHelpers";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useTeacherDashboard();

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  const { teacher, subjects, todayTimetables, timetables, attendance, results } = data;

  if (!teacher) {
    return (
      <div>
        <DashboardHeader name={user?.name} role="TEACHER" />
        <DashboardEmptyState message="No teacher profile linked to your account. Contact administration." />
      </div>
    );
  }

  const uniqueStudentIds = new Set(attendance.map((a) => a.studentId));
  const attendanceBySubject = groupCount(attendance, (a) => a.subjectName || "—");
  const attendanceStatus = groupCount(attendance, (a) => a.status);

  const today = [...todayTimetables].sort(sortByTime);
  const upcoming = [...timetables].sort(sortByTime).slice(0, 6);

  return (
    <div>
      <DashboardHeader
        name={`${teacher.firstName} ${teacher.lastName}`}
        role="TEACHER"
        subtitle={`${teacher.specialization ?? ""}${teacher.departmentName ? " · " + teacher.departmentName : ""}`}
      />

      <DashboardGrid cols={4}>
        <StatsCard label="Today's Classes" value={today.length} icon={CalendarClock} tone="primary" />
        <StatsCard label="Subjects Assigned" value={subjects.length} icon={Library} tone="info" />
        <StatsCard label="Attendance Recorded" value={attendance.length} icon={ClipboardCheck} tone="success" />
        <StatsCard label="Results Entered" value={results.length} icon={Award} tone="warning" />
        <StatsCard label="Unique Students" value={uniqueStudentIds.size} icon={Users} tone="primary" />
        <StatsCard label="Total Schedule Slots" value={timetables.length} icon={CalendarClock} tone="info" />
      </DashboardGrid>

      <DashboardSection title="Quick Actions">
        <QuickActions
          actions={[
            { label: "Mark Attendance", to: "/attendance/mark", icon: ClipboardCheck },
            { label: "Enter Results", to: "/results", icon: Award },
            { label: "View Timetable", to: "/timetable", icon: CalendarClock },
            { label: "View Subjects", to: "/subjects", icon: Library },
            { label: "View Students", to: "/students", icon: Users },
            { label: "View Courses", to: "/courses", icon: BookOpen },
          ]}
        />
      </DashboardSection>

      <DashboardSection title="Today & Upcoming">
        <div className="grid gap-4 lg:grid-cols-2">
          <AnalyticsCard title="Today's Classes" description="Your schedule for today">
            {today.length === 0 ? (
              <DashboardEmptyState message="No classes today." />
            ) : (
              <ul className="divide-y">
                {today.map((t) => (
                  <li key={t.timetableId} className="flex items-center gap-3 py-3">
                    <div className="w-24 shrink-0 text-sm font-semibold tabular-nums">
                      {formatTime(t.startTime)}–{formatTime(t.endTime)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">
                        {t.subjectName ?? "Subject"}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {t.classroomName ?? ""} · {t.courseName ?? ""}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </AnalyticsCard>

          <AnalyticsCard title="Upcoming Classes" description="Your weekly rotation">
            {upcoming.length === 0 ? (
              <DashboardEmptyState message="No upcoming classes." />
            ) : (
              <ul className="divide-y">
                {upcoming.map((t) => (
                  <li key={t.timetableId} className="flex items-center gap-3 py-3">
                    <div className="w-24 shrink-0 text-xs font-medium text-muted-foreground">
                      {t.dayOfWeek.slice(0, 3)} {formatTime(t.startTime)}
                    </div>
                    <div className="min-w-0 flex-1 truncate text-sm">
                      {t.subjectName} · {t.classroomName}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </AnalyticsCard>
        </div>
      </DashboardSection>

      <DashboardSection title="Analytics">
        <div className="grid gap-4 lg:grid-cols-2">
          <BarChartCard title="Attendance by Subject" data={attendanceBySubject} />
          <PieChartCard title="Attendance Status" data={attendanceStatus} />
        </div>
      </DashboardSection>
    </div>
  );
}
