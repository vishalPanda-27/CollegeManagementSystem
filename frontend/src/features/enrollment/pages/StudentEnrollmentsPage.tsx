import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ArrowLeft, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { studentApi } from "@/features/student/api/studentApi";
import {
  useActiveEnrollmentsByStudent,
  useCompletedEnrollmentsByStudent,
  useEnrollmentsByStudent,
} from "../hooks/useEnrollments";
import {
  ENROLLMENT_STATUS_LABEL,
  type Enrollment,
  type EnrollmentStatus,
} from "../types";

const statusVariant: Record<
  EnrollmentStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  ENROLLED: "default",
  COMPLETED: "outline",
  DROPPED: "destructive",
  WITHDRAWN: "secondary",
};

function formatDate(v?: string | null) {
  if (!v) return "—";
  try {
    return new Date(v).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return String(v);
  }
}

function EnrollmentTable({
  data,
  isLoading,
  emptyLabel,
}: {
  data: Enrollment[] | undefined;
  isLoading: boolean;
  emptyLabel: string;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[70px]">ID</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Semester</TableHead>
            <TableHead>Academic year</TableHead>
            <TableHead>Enrolled on</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 7 }).map((__, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : !data || data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-8 text-center text-sm text-muted-foreground"
              >
                {emptyLabel}
              </TableCell>
            </TableRow>
          ) : (
            data.map((e) => (
              <TableRow key={e.enrollmentId}>
                <TableCell className="font-mono text-xs">
                  {e.enrollmentId}
                </TableCell>
                <TableCell className="font-medium">{e.courseName}</TableCell>
                <TableCell className="text-muted-foreground">
                  {e.semester || "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {e.academicYear || "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(e.enrollmentDate)}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {e.grade != null ? e.grade.toFixed(2) : "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[e.status]}>
                    {ENROLLMENT_STATUS_LABEL[e.status]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function StudentEnrollmentsPage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const studentsQuery = useQuery({
    queryKey: ["students"],
    queryFn: studentApi.list,
  });

  const filteredStudents = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = studentsQuery.data ?? [];
    if (!q) return list.slice(0, 20);
    return list
      .filter(
        (s) =>
          s.rollNumber.toLowerCase().includes(q) ||
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q),
      )
      .slice(0, 20);
  }, [studentsQuery.data, query]);

  const selectedStudent = useMemo(
    () => (studentsQuery.data ?? []).find((s) => s.id === selectedId) ?? null,
    [studentsQuery.data, selectedId],
  );

  const activeQuery = useActiveEnrollmentsByStudent(selectedId);
  const completedQuery = useCompletedEnrollmentsByStudent(selectedId);
  const allQuery = useEnrollmentsByStudent(selectedId);

  return (
    <div>
      <PageHeader
        title="Student enrollments"
        description="Search a student and review their active and completed courses."
        actions={
          <Button asChild variant="outline">
            <Link to="/enrollments">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to enrollments
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Find a student</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or roll no..."
                className="pl-8"
              />
            </div>
            <div className="max-h-[520px] space-y-1 overflow-y-auto">
              {studentsQuery.isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))
              ) : filteredStudents.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  No students found.
                </p>
              ) : (
                filteredStudents.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedId(s.id)}
                    className={`w-full rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                      selectedId === s.id
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:bg-muted"
                    }`}
                  >
                    <div className="font-medium">
                      {s.firstName} {s.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {s.rollNumber} · {s.departmentName ?? "—"}
                    </div>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {!selectedStudent ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
                <GraduationCap className="h-10 w-10" />
                <div className="text-sm">
                  Select a student to view their enrollments.
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm sm:grid-cols-4">
                  <div>
                    <div className="text-xs uppercase text-muted-foreground">
                      Roll no.
                    </div>
                    <div className="font-mono">{selectedStudent.rollNumber}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-muted-foreground">
                      Department
                    </div>
                    <div>{selectedStudent.departmentName ?? "—"}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-muted-foreground">
                      Email
                    </div>
                    <div className="truncate">{selectedStudent.email}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-muted-foreground">
                      Status
                    </div>
                    <Badge>{selectedStudent.status}</Badge>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h3 className="mb-2 text-sm font-semibold">
                  Active enrollments
                </h3>
                <EnrollmentTable
                  data={activeQuery.data}
                  isLoading={activeQuery.isLoading}
                  emptyLabel="No active enrollments."
                />
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold">
                  Completed enrollments
                </h3>
                <EnrollmentTable
                  data={completedQuery.data}
                  isLoading={completedQuery.isLoading}
                  emptyLabel="No completed enrollments."
                />
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold">
                  Full enrollment history
                </h3>
                <EnrollmentTable
                  data={allQuery.data}
                  isLoading={allQuery.isLoading}
                  emptyLabel="No enrollment history."
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
