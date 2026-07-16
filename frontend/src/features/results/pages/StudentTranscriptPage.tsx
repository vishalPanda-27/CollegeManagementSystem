import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowLeft, Printer, GraduationCap, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
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
  useResultsByStudent,
  useStudentCgpa,
  useStudentPercentage,
} from "../hooks/useResults";
import { GradeBadge, StatusBadge } from "../components/ResultBadges";

export default function StudentTranscriptPage() {
  const studentsQuery = useQuery({ queryKey: ["students"], queryFn: studentApi.list });
  const [studentId, setStudentId] = useState<number | null>(null);

  const resultsQuery = useResultsByStudent(studentId);
  const pctQuery = useStudentPercentage(studentId);
  const cgpaQuery = useStudentCgpa(studentId);

  const student = useMemo(
    () => studentsQuery.data?.find((s) => s.id === studentId) ?? null,
    [studentsQuery.data, studentId],
  );

  const results = resultsQuery.data ?? [];

  const handlePrint = () => window.print();

  return (
    <div>
      <div className="print:hidden">
        <PageHeader
          title="Student transcript"
          description="Subject-wise result breakdown with overall percentage and CGPA."
          actions={
            <div className="flex items-center gap-2">
              <Button asChild variant="outline">
                <Link to="/results">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Link>
              </Button>
              <Button onClick={handlePrint} disabled={!studentId || results.length === 0}>
                <Printer className="mr-2 h-4 w-4" /> Print transcript
              </Button>
            </div>
          }
        />

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="w-full sm:max-w-sm">
            <label className="mb-1.5 block text-sm font-medium">Select student</label>
            <Select
              value={studentId ? String(studentId) : ""}
              onValueChange={(v) => setStudentId(Number(v))}
              disabled={studentsQuery.isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a student" />
              </SelectTrigger>
              <SelectContent>
                {studentsQuery.data?.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.firstName} {s.lastName} · {s.rollNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {!studentId ? (
        <div className="rounded-lg border bg-card p-10 text-center text-muted-foreground">
          <GraduationCap className="mx-auto mb-3 h-10 w-10 opacity-60" />
          Select a student to view their transcript.
        </div>
      ) : (
        <div className="space-y-6 print:space-y-4">
          <div className="rounded-lg border bg-card p-6 print:border-black">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase text-muted-foreground">
                  Academic transcript
                </div>
                <h2 className="mt-1 text-2xl font-bold">
                  {student ? `${student.firstName} ${student.lastName}` : "Student"}
                </h2>
                {student && (
                  <div className="mt-1 text-sm text-muted-foreground">
                    Roll No: {student.rollNumber} · {student.email}
                    {student.departmentName ? ` · ${student.departmentName}` : ""}
                  </div>
                )}
              </div>
              <div className="text-right text-xs text-muted-foreground">
                Generated on {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card">
            {resultsQuery.isLoading ? (
              <div className="flex items-center justify-center p-10 text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
              </div>
            ) : results.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground">
                No results available for this student.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[70px]">#</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-right">Marks</TableHead>
                    <TableHead className="text-right">Max</TableHead>
                    <TableHead className="text-right">%</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((r, i) => (
                    <TableRow key={r.resultId}>
                      <TableCell className="font-medium">{i + 1}</TableCell>
                      <TableCell>{r.subjectName}</TableCell>
                      <TableCell className="text-right">{r.marksObtained}</TableCell>
                      <TableCell className="text-right">{r.maximumMarks}</TableCell>
                      <TableCell className="text-right">
                        {r.percentage?.toFixed(2) ?? "—"}%
                      </TableCell>
                      <TableCell><GradeBadge grade={r.grade} /></TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 print:grid-cols-2">
            <div className="rounded-lg border bg-card p-5">
              <div className="text-xs font-medium uppercase text-muted-foreground">
                Overall percentage
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {pctQuery.isLoading ? "…" : `${(pctQuery.data ?? 0).toFixed(2)}%`}
                </span>
              </div>
              <Progress
                value={Math.min(100, Math.max(0, pctQuery.data ?? 0))}
                className="mt-3"
              />
            </div>
            <div className="rounded-lg border bg-card p-5">
              <div className="text-xs font-medium uppercase text-muted-foreground">
                Overall CGPA (out of 10)
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {cgpaQuery.isLoading
                    ? "…"
                    : cgpaQuery.isError
                      ? "—"
                      : (cgpaQuery.data ?? 0).toFixed(2)}
                </span>
              </div>
              <Progress
                value={Math.min(100, ((cgpaQuery.data ?? 0) / 10) * 100)}
                className="mt-3"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
