import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { ErrorState } from "@/components/common/ErrorState";
import { useAttendanceList } from "../hooks/useAttendance";
import {
  ATTENDANCE_STATUSES,
  ATTENDANCE_STATUS_LABEL,
  type AttendanceStatus,
} from "../types";

const STATUS_COLOR: Record<AttendanceStatus, string> = {
  PRESENT: "#10b981",
  ABSENT: "#ef4444",
  LATE: "#f59e0b",
  LEAVE: "#3b82f6",
};

export default function AttendanceAnalyticsPage() {
  const query = useAttendanceList();
  const records = query.data ?? [];

  const pieData = useMemo(
    () =>
      ATTENDANCE_STATUSES.map((s) => ({
        name: ATTENDANCE_STATUS_LABEL[s],
        value: records.filter((r) => r.status === s).length,
        status: s,
      })),
    [records],
  );

  const bySubject = useMemo(() => {
    const map = new Map<string, { name: string; present: number; total: number }>();
    for (const r of records) {
      const cur = map.get(r.subjectName) ?? {
        name: r.subjectName,
        present: 0,
        total: 0,
      };
      cur.total++;
      if (r.status === "PRESENT") cur.present++;
      map.set(r.subjectName, cur);
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total).slice(0, 12);
  }, [records]);

  const dailyTrend = useMemo(() => {
    const map = new Map<string, { date: string; present: number; absent: number; total: number }>();
    for (const r of records) {
      const cur = map.get(r.attendanceDate) ?? {
        date: r.attendanceDate,
        present: 0,
        absent: 0,
        total: 0,
      };
      cur.total++;
      if (r.status === "PRESENT") cur.present++;
      if (r.status === "ABSENT") cur.absent++;
      map.set(r.attendanceDate, cur);
    }
    return Array.from(map.values())
      .sort((a, b) => (a.date < b.date ? -1 : 1))
      .slice(-30);
  }, [records]);

  const studentPct = useMemo(() => {
    const map = new Map<
      number,
      { studentId: number; name: string; present: number; total: number }
    >();
    for (const r of records) {
      const cur = map.get(r.studentId) ?? {
        studentId: r.studentId,
        name: r.studentName,
        present: 0,
        total: 0,
      };
      cur.total++;
      if (r.status === "PRESENT") cur.present++;
      map.set(r.studentId, cur);
    }
    return Array.from(map.values())
      .map((s) => ({
        ...s,
        pct: s.total ? Math.round((s.present / s.total) * 100) : 0,
      }))
      .sort((a, b) => b.pct - a.pct);
  }, [records]);

  if (query.isLoading) {
    return (
      <div>
        <PageHeader title="Attendance analytics" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div>
        <PageHeader title="Attendance analytics" />
        <ErrorState onRetry={() => query.refetch()} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Attendance analytics"
        description="Insights across all attendance records."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-4">
          <h3 className="mb-4 text-sm font-semibold">Attendance distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLOR[entry.status]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <h3 className="mb-4 text-sm font-semibold">Attendance per subject</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bySubject}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={70}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#10b981" name="Present" />
                <Bar dataKey="total" fill="#94a3b8" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold">Daily attendance trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="present"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Present"
                />
                <Line
                  type="monotone"
                  dataKey="absent"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Absent"
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#6366f1"
                  strokeWidth={2}
                  name="Total"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold">
            Student attendance percentage
          </h3>
          {studentPct.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No attendance data yet.
            </div>
          ) : (
            <div className="space-y-3">
              {studentPct.map((s) => (
                <div key={s.studentId} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-muted-foreground">
                      {s.present}/{s.total} · {s.pct}%
                    </span>
                  </div>
                  <Progress value={s.pct} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
