import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
  Eye,
  MoreHorizontal,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Percent,
  Award,
  BookOpen,
  BarChart3,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ErrorState } from "@/components/common/ErrorState";
import { studentApi } from "@/features/student/api/studentApi";
import { subjectApi } from "@/features/subject/api/subjectApi";
import { ResultFormDialog } from "../components/ResultFormDialog";
import { ResultViewDrawer } from "../components/ResultViewDrawer";
import { GradeBadge, StatusBadge } from "../components/ResultBadges";
import {
  useResults,
  useCreateResult,
  useUpdateResult,
  useDeleteResult,
} from "../hooks/useResults";
import { GRADES, RESULT_STATUSES, type Result, type ResultRequest } from "../types";

const PAGE_SIZE = 10;

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "default" | "success" | "danger" | "info" | "warning";
}

function StatCard({ label, value, icon: Icon, tone = "default" }: StatCardProps) {
  const toneClass =
    tone === "success"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : tone === "danger"
        ? "bg-red-500/10 text-red-600 dark:text-red-400"
        : tone === "info"
          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
          : tone === "warning"
            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            : "bg-primary/10 text-primary";
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-medium text-muted-foreground">{label}</div>
          <div className="mt-1 text-2xl font-semibold">{value}</div>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

type SortKey = "resultId" | "studentName" | "subjectName" | "percentage" | "grade";

function gradePoints(pct: number): number {
  if (pct >= 90) return 10;
  if (pct >= 80) return 9;
  if (pct >= 70) return 8;
  if (pct >= 60) return 7;
  if (pct >= 50) return 6;
  if (pct >= 40) return 5;
  return 0;
}

export default function ResultsPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [studentFilter, setStudentFilter] = useState<string>("ALL");
  const [subjectFilter, setSubjectFilter] = useState<string>("ALL");
  const [gradeFilter, setGradeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("resultId");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Result | null>(null);
  const [viewing, setViewing] = useState<Result | null>(null);
  const [toDelete, setToDelete] = useState<Result | null>(null);

  const listQuery = useResults();
  const studentsQuery = useQuery({ queryKey: ["students"], queryFn: studentApi.list });
  const subjectsQuery = useQuery({ queryKey: ["subjects"], queryFn: subjectApi.list });

  const createMut = useCreateResult(() => {
    setFormOpen(false);
    setEditing(null);
  });
  const updateMut = useUpdateResult(() => {
    setFormOpen(false);
    setEditing(null);
  });
  const deleteMut = useDeleteResult(() => setToDelete(null));

  const records = listQuery.data ?? [];

  const stats = useMemo(() => {
    const total = records.length;
    let passed = 0;
    let failed = 0;
    let pctSum = 0;
    const byStudent = new Map<number, { sum: number; count: number }>();
    for (const r of records) {
      if (r.status === "PASS") passed++;
      else if (r.status === "FAIL") failed++;
      pctSum += r.percentage ?? 0;
      const gp = gradePoints(r.percentage ?? 0);
      const s = byStudent.get(r.studentId) ?? { sum: 0, count: 0 };
      s.sum += gp;
      s.count += 1;
      byStudent.set(r.studentId, s);
    }
    const avgPct = total ? pctSum / total : 0;
    let cgpaSum = 0;
    let cgpaCount = 0;
    byStudent.forEach((v) => {
      cgpaSum += v.sum / v.count;
      cgpaCount++;
    });
    const avgCgpa = cgpaCount ? cgpaSum / cgpaCount : 0;
    return { total, passed, failed, avgPct, avgCgpa };
  }, [records]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const arr = records.filter((r) => {
      if (studentFilter !== "ALL" && String(r.studentId) !== studentFilter) return false;
      if (subjectFilter !== "ALL" && String(r.subjectId) !== subjectFilter) return false;
      if (gradeFilter !== "ALL" && r.grade !== gradeFilter) return false;
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        r.studentName.toLowerCase().includes(q) ||
        r.subjectName.toLowerCase().includes(q) ||
        (r.grade ?? "").toLowerCase().includes(q)
      );
    });
    return [...arr].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [records, query, studentFilter, subjectFilter, gradeFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageData = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (r: Result) => {
    setEditing(r);
    setFormOpen(true);
  };
  const handleSubmit = (payload: ResultRequest) => {
    if (editing) updateMut.mutate({ id: editing.resultId, data: payload });
    else createMut.mutate(payload);
  };

  const resetFilters = () => {
    setQuery("");
    setStudentFilter("ALL");
    setSubjectFilter("ALL");
    setGradeFilter("ALL");
    setStatusFilter("ALL");
    setPage(1);
  };

  const hasFilters =
    !!query ||
    studentFilter !== "ALL" ||
    subjectFilter !== "ALL" ||
    gradeFilter !== "ALL" ||
    statusFilter !== "ALL";

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setSortDir("asc");
    }
  };

  return (
    <div>
      <PageHeader
        title="Results"
        description="Manage examination results, transcripts and analytics."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => listQuery.refetch()}
              disabled={listQuery.isFetching}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${listQuery.isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" /> Add result
            </Button>
          </div>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Total results" value={stats.total} icon={FileText} />
        <StatCard label="Passed" value={stats.passed} icon={CheckCircle2} tone="success" />
        <StatCard label="Failed" value={stats.failed} icon={XCircle} tone="danger" />
        <StatCard
          label="Avg percentage"
          value={`${stats.avgPct.toFixed(2)}%`}
          icon={Percent}
          tone="info"
        />
        <StatCard
          label="Avg CGPA"
          value={stats.avgCgpa.toFixed(2)}
          icon={Award}
          tone="warning"
        />
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/results/transcript"
          className="rounded-lg border bg-card p-4 transition hover:border-primary/60 hover:shadow-sm"
        >
          <GraduationCap className="mb-2 h-5 w-5 text-primary" />
          <div className="text-sm font-semibold">Student transcript</div>
          <div className="text-xs text-muted-foreground">
            Subject-wise results, percentage & CGPA
          </div>
        </Link>
        <Link
          to="/results/subject"
          className="rounded-lg border bg-card p-4 transition hover:border-primary/60 hover:shadow-sm"
        >
          <BookOpen className="mb-2 h-5 w-5 text-primary" />
          <div className="text-sm font-semibold">Subject results</div>
          <div className="text-xs text-muted-foreground">All results for a subject</div>
        </Link>
        <Link
          to="/results/analytics"
          className="rounded-lg border bg-card p-4 transition hover:border-primary/60 hover:shadow-sm"
        >
          <BarChart3 className="mb-2 h-5 w-5 text-primary" />
          <div className="text-sm font-semibold">Analytics</div>
          <div className="text-xs text-muted-foreground">Distribution and trend charts</div>
        </Link>
      </div>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search student, subject or grade..."
            className="pl-8"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              {RESULT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={gradeFilter} onValueChange={(v) => { setGradeFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All grades</SelectItem>
              {GRADES.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={studentFilter} onValueChange={(v) => { setStudentFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Student" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All students</SelectItem>
              {studentsQuery.data?.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.firstName} {s.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={subjectFilter} onValueChange={(v) => { setSubjectFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All subjects</SelectItem>
              {subjectsQuery.data?.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.subjectName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        {listQuery.isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : listQuery.isError ? (
          <div className="p-6">
            <ErrorState onRetry={() => listQuery.refetch()} />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] cursor-pointer" onClick={() => toggleSort("resultId")}>
                  ID
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("studentName")}>
                  Student
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("subjectName")}>
                  Subject
                </TableHead>
                <TableHead className="text-right">Marks</TableHead>
                <TableHead className="text-right">Max</TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => toggleSort("percentage")}>
                  %
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("grade")}>
                  Grade
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                pageData.map((r) => (
                  <TableRow key={r.resultId}>
                    <TableCell className="font-medium">#{r.resultId}</TableCell>
                    <TableCell>{r.studentName}</TableCell>
                    <TableCell>{r.subjectName}</TableCell>
                    <TableCell className="text-right">{r.marksObtained}</TableCell>
                    <TableCell className="text-right">{r.maximumMarks}</TableCell>
                    <TableCell className="text-right">
                      {r.percentage?.toFixed(2) ?? "—"}%
                    </TableCell>
                    <TableCell><GradeBadge grade={r.grade} /></TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewing(r)}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(r)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setToDelete(r)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {pageData.length} of {filtered.length}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <span>
            Page {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>

      <ResultFormDialog
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditing(null);
        }}
        editing={editing}
        submitting={createMut.isPending || updateMut.isPending}
        onSubmit={handleSubmit}
      />

      <ResultViewDrawer
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
        result={viewing}
      />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete result?"
        description={
          toDelete
            ? `Delete result #${toDelete.resultId} for ${toDelete.studentName} in ${toDelete.subjectName}? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => toDelete && deleteMut.mutate(toDelete.resultId)}
      />
    </div>
  );
}
