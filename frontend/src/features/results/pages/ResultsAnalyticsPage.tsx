import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { studentApi } from "@/features/student/api/studentApi";
import {
  useResults,
  useStudentCgpa,
  useStudentPercentage,
} from "../hooks/useResults";
import { GRADES } from "../types";

const GRADE_COLORS: Record<string, string> = {
  "A+": "#10b981",
  A: "#22c55e",
  B: "#3b82f6",
  C: "#eab308",
  D: "#f97316",
  F: "#ef4444",
};

export default function ResultsAnalyticsPage() {
  const listQuery = useResults();
  const studentsQuery = useQuery({ queryKey: ["students"], queryFn: studentApi.list });
  const [studentId, setStudentId] = useState<number | null>(null);

  const pctQuery = useStudentPercentage(studentId);
  const cgpaQuery = useStudentCgpa(studentId);

  const results = listQuery.data ?? [];

  const passFail = useMemo(() => {
    let pass = 0;
    let fail = 0;
    for (const r of results) {
      if (r.status === "PASS") pass++;
      else if (r.status === "FAIL") fail++;
    }
    return [
      { name: "Pass", value: pass, color: "#10b981" },
      { name: "Fail", value: fail, color: "#ef4444" },
    ];
  }, [results]);

  const avgBySubject = useMemo(() => {
    const map = new Map<string, { sum: number; count: number }>();
    for (const r of results) {
      const key = r.subjectName;
      const cur = map.get(key) ?? { sum: 0, count: 0 };
      cur.sum += r.percentage ?? 0;
      cur.count += 1;
      map.set(key, cur);
    }
    return Array.from(map.entries()).map(([subject, v]) => ({
      subject,
      average: +(v.sum / v.count).toFixed(2),
    }));
  }, [results]);

  const gradeDist = useMemo(() => {
    const counts: Record<string, number> = {};
    GRADES.forEach((g) => (counts[g] = 0));
    for (const r of results) {
      if (r.grade && counts[r.grade] != null) counts[r.grade]++;
    }
    return GRADES.map((g) => ({ grade: g, count: counts[g], color: GRADE_COLORS[g] }));
  }, [results]);

  const avgByStudent = useMemo(() => {
    const map = new Map<string, { sum: number; count: number }>();
    for (const r of results) {
      const key = r.studentName;
      const cur = map.get(key) ?? { sum: 0, count: 0 };
      cur.sum += r.percentage ?? 0;
      cur.count += 1;
      map.set(key, cur);
    }
    return Array.from(map.entries())
      .map(([student, v]) => ({ student, average: +(v.sum / v.count).toFixed(2) }))
      .sort((a, b) => a.student.localeCompare(b.student));
  }, [results]);

  return (
    <div>
      <PageHeader
        title="Results analytics"
        description="Distribution, subject averages and per-student progress."
        actions={
          <Button asChild variant="outline">
            <Link to="/results">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Pass vs Fail</div>
              <div className="text-xs text-muted-foreground">
                Overall result status distribution
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={passFail}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {passFail.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="mb-3">
            <div className="text-sm font-semibold">Grade distribution</div>
            <div className="text-xs text-muted-foreground">Count per grade</div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDist}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="grade" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count">
                  {gradeDist.map((entry) => (
                    <Cell key={entry.grade} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 lg:col-span-2">
          <div className="mb-3">
            <div className="text-sm font-semibold">Average marks by subject</div>
            <div className="text-xs text-muted-foreground">
              Average percentage of all students per subject
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgBySubject}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="subject" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={70} />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="average" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 lg:col-span-2">
          <div className="mb-3">
            <div className="text-sm font-semibold">Average student percentage</div>
            <div className="text-xs text-muted-foreground">Per-student average across subjects</div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={avgByStudent}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="student" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={70} />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Line type="monotone" dataKey="average" stroke="#3b82f6" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 lg:col-span-2">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-sm font-semibold">Student progress</div>
              <div className="text-xs text-muted-foreground">
                Overall percentage and CGPA for a selected student
              </div>
            </div>
            <div className="w-full sm:max-w-xs">
              <Select
                value={studentId ? String(studentId) : ""}
                onValueChange={(v) => setStudentId(Number(v))}
                disabled={studentsQuery.isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {studentsQuery.data?.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.firstName} {s.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {studentId ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <div className="text-xs text-muted-foreground">Overall percentage</div>
                <div className="mt-1 text-2xl font-semibold">
                  {pctQuery.isLoading ? "…" : `${(pctQuery.data ?? 0).toFixed(2)}%`}
                </div>
                <Progress
                  value={Math.min(100, Math.max(0, pctQuery.data ?? 0))}
                  className="mt-3"
                />
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-xs text-muted-foreground">CGPA (out of 10)</div>
                <div className="mt-1 text-2xl font-semibold">
                  {cgpaQuery.isLoading
                    ? "…"
                    : cgpaQuery.isError
                      ? "—"
                      : (cgpaQuery.data ?? 0).toFixed(2)}
                </div>
                <Progress
                  value={Math.min(100, ((cgpaQuery.data ?? 0) / 10) * 100)}
                  className="mt-3"
                />
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Select a student to see progress indicators.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
