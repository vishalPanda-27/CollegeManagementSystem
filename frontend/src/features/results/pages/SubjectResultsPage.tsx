import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { subjectApi } from "@/features/subject/api/subjectApi";
import { useResultsBySubject } from "../hooks/useResults";
import { GradeBadge, StatusBadge } from "../components/ResultBadges";

export default function SubjectResultsPage() {
  const subjectsQuery = useQuery({ queryKey: ["subjects"], queryFn: subjectApi.list });
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const resultsQuery = useResultsBySubject(subjectId);
  const subject = useMemo(
    () => subjectsQuery.data?.find((s) => s.id === subjectId) ?? null,
    [subjectsQuery.data, subjectId],
  );
  const results = resultsQuery.data ?? [];

  const stats = useMemo(() => {
    if (!results.length) return { avg: 0, pass: 0, fail: 0 };
    const avg =
      results.reduce((a, r) => a + (r.percentage ?? 0), 0) / results.length;
    return {
      avg,
      pass: results.filter((r) => r.status === "PASS").length,
      fail: results.filter((r) => r.status === "FAIL").length,
    };
  }, [results]);

  return (
    <div>
      <PageHeader
        title="Subject results"
        description="All student results for a selected subject."
        actions={
          <Button asChild variant="outline">
            <Link to="/results">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
          </Button>
        }
      />

      <div className="mb-6 w-full sm:max-w-sm">
        <label className="mb-1.5 block text-sm font-medium">Select subject</label>
        <Select
          value={subjectId ? String(subjectId) : ""}
          onValueChange={(v) => setSubjectId(Number(v))}
          disabled={subjectsQuery.isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a subject" />
          </SelectTrigger>
          <SelectContent>
            {subjectsQuery.data?.map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {s.subjectName} ({s.subjectCode})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!subjectId ? (
        <div className="rounded-lg border bg-card p-10 text-center text-muted-foreground">
          <BookOpen className="mx-auto mb-3 h-10 w-10 opacity-60" />
          Select a subject to view its results.
        </div>
      ) : (
        <>
          {subject && (
            <div className="mb-6 grid gap-3 sm:grid-cols-4">
              <div className="rounded-lg border bg-card p-4">
                <div className="text-xs text-muted-foreground">Subject</div>
                <div className="mt-1 font-semibold">{subject.subjectName}</div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="text-xs text-muted-foreground">Average %</div>
                <div className="mt-1 text-xl font-semibold">
                  {stats.avg.toFixed(2)}%
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="text-xs text-muted-foreground">Passed</div>
                <div className="mt-1 text-xl font-semibold text-emerald-600 dark:text-emerald-400">
                  {stats.pass}
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="text-xs text-muted-foreground">Failed</div>
                <div className="mt-1 text-xl font-semibold text-red-600 dark:text-red-400">
                  {stats.fail}
                </div>
              </div>
            </div>
          )}

          <div className="rounded-lg border bg-card">
            {resultsQuery.isLoading ? (
              <div className="flex items-center justify-center p-10 text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
              </div>
            ) : results.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground">
                No results found for this subject.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-right">Marks</TableHead>
                    <TableHead className="text-right">Max</TableHead>
                    <TableHead className="text-right">%</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((r) => (
                    <TableRow key={r.resultId}>
                      <TableCell>{r.studentName}</TableCell>
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
        </>
      )}
    </div>
  );
}
