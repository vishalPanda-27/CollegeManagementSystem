import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ArrowLeft, BookOpen } from "lucide-react";
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
import { courseApi } from "@/features/course/api/courseApi";
import { useEnrollmentsByCourse } from "../hooks/useEnrollments";
import {
  ENROLLMENT_STATUS_LABEL,
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

export default function CourseEnrollmentsPage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const coursesQuery = useQuery({
    queryKey: ["courses"],
    queryFn: courseApi.list,
  });

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = coursesQuery.data ?? [];
    if (!q) return list.slice(0, 20);
    return list
      .filter(
        (c) =>
          c.courseCode.toLowerCase().includes(q) ||
          c.courseName.toLowerCase().includes(q),
      )
      .slice(0, 20);
  }, [coursesQuery.data, query]);

  const selectedCourse = useMemo(
    () => (coursesQuery.data ?? []).find((c) => c.id === selectedId) ?? null,
    [coursesQuery.data, selectedId],
  );

  const enrollmentsQuery = useEnrollmentsByCourse(selectedId);
  const enrollments = enrollmentsQuery.data ?? [];

  return (
    <div>
      <PageHeader
        title="Course enrollments"
        description="Search a course and review the students enrolled with their grades and statuses."
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
            <CardTitle className="text-sm">Find a course</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by code or name..."
                className="pl-8"
              />
            </div>
            <div className="max-h-[520px] space-y-1 overflow-y-auto">
              {coursesQuery.isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))
              ) : filteredCourses.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  No courses found.
                </p>
              ) : (
                filteredCourses.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={`w-full rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                      selectedId === c.id
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:bg-muted"
                    }`}
                  >
                    <div className="font-medium">{c.courseName}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.courseCode} · {c.departmentName ?? "—"}
                    </div>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {!selectedCourse ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
                <BookOpen className="h-10 w-10" />
                <div className="text-sm">
                  Select a course to view its enrollments.
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {selectedCourse.courseName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm sm:grid-cols-4">
                  <div>
                    <div className="text-xs uppercase text-muted-foreground">
                      Code
                    </div>
                    <div className="font-mono">{selectedCourse.courseCode}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-muted-foreground">
                      Credits
                    </div>
                    <div>{selectedCourse.credits}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-muted-foreground">
                      Semester
                    </div>
                    <div>{selectedCourse.semester}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-muted-foreground">
                      Department
                    </div>
                    <div>{selectedCourse.departmentName ?? "—"}</div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h3 className="mb-2 text-sm font-semibold">
                  Enrolled students ({enrollments.length})
                </h3>
                <div className="overflow-x-auto rounded-lg border bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[70px]">ID</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Semester</TableHead>
                        <TableHead>Academic year</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollmentsQuery.isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <TableRow key={i}>
                            {Array.from({ length: 6 }).map((__, j) => (
                              <TableCell key={j}>
                                <Skeleton className="h-4 w-full" />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : enrollments.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="py-8 text-center text-sm text-muted-foreground"
                          >
                            No students are enrolled in this course.
                          </TableCell>
                        </TableRow>
                      ) : (
                        enrollments.map((e) => (
                          <TableRow key={e.enrollmentId}>
                            <TableCell className="font-mono text-xs">
                              {e.enrollmentId}
                            </TableCell>
                            <TableCell className="font-medium">
                              {e.studentName}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {e.semester || "—"}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {e.academicYear || "—"}
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
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
