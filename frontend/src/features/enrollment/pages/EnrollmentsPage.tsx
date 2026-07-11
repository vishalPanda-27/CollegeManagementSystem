import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Ban,
  MoreHorizontal,
  BookOpen,
  User,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ErrorState } from "@/components/common/ErrorState";
import { EnrollmentFormDialog } from "../components/EnrollmentFormDialog";
import { EnrollmentViewDrawer } from "../components/EnrollmentViewDrawer";
import {
  useEnrollments,
  useCreateEnrollment,
  useUpdateEnrollment,
  useDeleteEnrollment,
  useCompleteEnrollment,
  useDropEnrollment,
} from "../hooks/useEnrollments";
import {
  ENROLLMENT_STATUSES,
  ENROLLMENT_STATUS_LABEL,
  type Enrollment,
  type EnrollmentRequest,
  type EnrollmentStatus,
} from "../types";

const PAGE_SIZE = 10;

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

const statusVariant: Record<
  EnrollmentStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  ENROLLED: "default",
  COMPLETED: "outline",
  DROPPED: "destructive",
  WITHDRAWN: "secondary",
};

type SortKey =
  | "enrollmentId"
  | "studentName"
  | "courseName"
  | "enrollmentDate"
  | "status";

export default function EnrollmentsPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("enrollmentId");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Enrollment | null>(null);
  const [viewing, setViewing] = useState<Enrollment | null>(null);
  const [toDelete, setToDelete] = useState<Enrollment | null>(null);
  const [toComplete, setToComplete] = useState<Enrollment | null>(null);
  const [toDrop, setToDrop] = useState<Enrollment | null>(null);

  const listQuery = useEnrollments();
  const createMut = useCreateEnrollment(() => {
    setFormOpen(false);
    setEditing(null);
  });
  const updateMut = useUpdateEnrollment(() => {
    setFormOpen(false);
    setEditing(null);
  });
  const deleteMut = useDeleteEnrollment(() => setToDelete(null));
  const completeMut = useCompleteEnrollment();
  const dropMut = useDropEnrollment();

  const enrollments = listQuery.data ?? [];

  const stats = useMemo(() => {
    const s = {
      total: enrollments.length,
      ENROLLED: 0,
      COMPLETED: 0,
      DROPPED: 0,
      WITHDRAWN: 0,
    };
    for (const e of enrollments) s[e.status] += 1;
    return s;
  }, [enrollments]);

  const availableYears = useMemo(() => {
    const set = new Set<string>();
    for (const e of enrollments) if (e.academicYear) set.add(e.academicYear);
    return Array.from(set).sort().reverse();
  }, [enrollments]);

  const availableSemesters = useMemo(() => {
    const set = new Set<string>();
    for (const e of enrollments) if (e.semester) set.add(e.semester);
    return Array.from(set).sort();
  }, [enrollments]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = enrollments.filter((e) => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (yearFilter !== "all" && e.academicYear !== yearFilter) return false;
      if (semesterFilter !== "all" && e.semester !== semesterFilter)
        return false;
      if (!q) return true;
      return (
        e.studentName.toLowerCase().includes(q) ||
        e.courseName.toLowerCase().includes(q) ||
        String(e.enrollmentId).includes(q)
      );
    });
    const dir = sortDir === "asc" ? 1 : -1;
    return out.sort((a, b) => {
      const av = (a[sortKey] ?? "") as string | number;
      const bv = (b[sortKey] ?? "") as string | number;
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [
    enrollments,
    query,
    statusFilter,
    yearFilter,
    semesterFilter,
    sortKey,
    sortDir,
  ]);

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
  const openEdit = (e: Enrollment) => {
    setEditing(e);
    setFormOpen(true);
  };
  const handleSubmit = (payload: EnrollmentRequest) => {
    if (editing) updateMut.mutate({ id: editing.enrollmentId, data: payload });
    else createMut.mutate(payload);
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const statCards = [
    {
      label: "Total enrollments",
      value: stats.total,
      icon: ClipboardList,
      accent: "bg-primary/10 text-primary",
    },
    {
      label: "Active",
      value: stats.ENROLLED,
      icon: CheckCircle2,
      accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Completed",
      value: stats.COMPLETED,
      icon: CheckCircle2,
      accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Dropped",
      value: stats.DROPPED,
      icon: XCircle,
      accent: "bg-red-500/10 text-red-600 dark:text-red-400",
    },
    {
      label: "Withdrawn",
      value: stats.WITHDRAWN,
      icon: Ban,
      accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Enrollments"
        description="Manage student-course enrollments, status changes, and academic records."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => listQuery.refetch()}
              disabled={listQuery.isFetching}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${
                  listQuery.isFetching ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" /> New enrollment
            </Button>
          </div>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {c.label}
              </CardTitle>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-md ${c.accent}`}
              >
                <c.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {listQuery.isLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <div className="text-2xl font-bold">{c.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Link to="/enrollments/students" className="group">
          <Card className="transition-colors group-hover:border-primary">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Student enrollments</div>
                <div className="text-xs text-muted-foreground">
                  View a student's active & completed courses
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/enrollments/courses" className="group">
          <Card className="transition-colors group-hover:border-primary">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Course enrollments</div>
                <div className="text-xs text-muted-foreground">
                  View all students enrolled in a course
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <button type="button" onClick={openCreate} className="group text-left">
          <Card className="transition-colors group-hover:border-primary">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Create enrollment</div>
                <div className="text-xs text-muted-foreground">
                  Start the two-step enrollment wizard
                </div>
              </div>
            </CardContent>
          </Card>
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search student or course..."
              className="pl-8"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              {ENROLLMENT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {ENROLLMENT_STATUS_LABEL[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={yearFilter}
            onValueChange={(v) => {
              setYearFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Academic year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All years</SelectItem>
              {availableYears.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={semesterFilter}
            onValueChange={(v) => {
              setSemesterFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All semesters</SelectItem>
              {availableSemesters.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-xs text-muted-foreground">
          {filtered.length} enrollment{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => toggleSort("enrollmentId")}
                className="w-[70px] cursor-pointer select-none"
              >
                ID
              </TableHead>
              <TableHead
                onClick={() => toggleSort("studentName")}
                className="cursor-pointer select-none"
              >
                Student
              </TableHead>
              <TableHead
                onClick={() => toggleSort("courseName")}
                className="cursor-pointer select-none"
              >
                Course
              </TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Academic year</TableHead>
              <TableHead
                onClick={() => toggleSort("enrollmentDate")}
                className="cursor-pointer select-none"
              >
                Enrolled on
              </TableHead>
              <TableHead>Grade</TableHead>
              <TableHead
                onClick={() => toggleSort("status")}
                className="cursor-pointer select-none"
              >
                Status
              </TableHead>
              <TableHead className="w-[70px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listQuery.isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  {Array.from({ length: 9 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : listQuery.isError ? (
              <TableRow>
                <TableCell colSpan={9} className="py-10">
                  <ErrorState onRetry={() => listQuery.refetch()} />
                </TableCell>
              </TableRow>
            ) : pageData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-16">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <ClipboardList className="h-6 w-6" />
                    </div>
                    <div className="text-sm font-medium">
                      {query ||
                      statusFilter !== "all" ||
                      yearFilter !== "all" ||
                      semesterFilter !== "all"
                        ? "No matching enrollments"
                        : "No enrollments yet"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {query ||
                      statusFilter !== "all" ||
                      yearFilter !== "all" ||
                      semesterFilter !== "all"
                        ? "Try adjusting the filters."
                        : "Create the first enrollment to get started."}
                    </div>
                    {!query &&
                      statusFilter === "all" &&
                      yearFilter === "all" &&
                      semesterFilter === "all" && (
                        <Button size="sm" className="mt-2" onClick={openCreate}>
                          <Plus className="mr-2 h-4 w-4" /> New enrollment
                        </Button>
                      )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              pageData.map((e) => (
                <TableRow key={e.enrollmentId}>
                  <TableCell className="font-mono text-xs">
                    {e.enrollmentId}
                  </TableCell>
                  <TableCell className="font-medium">{e.studentName}</TableCell>
                  <TableCell>{e.courseName}</TableCell>
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
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewing(e)}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEdit(e)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {e.status === "ENROLLED" && (
                          <>
                            <DropdownMenuItem onClick={() => setToComplete(e)}>
                              <CheckCircle2 className="mr-2 h-4 w-4" /> Complete
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setToDrop(e)}>
                              <XCircle className="mr-2 h-4 w-4" /> Drop
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        <DropdownMenuItem
                          onClick={() => setToDelete(e)}
                          className="text-destructive focus:text-destructive"
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
      </div>

      {!listQuery.isLoading && !listQuery.isError && filtered.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[80px] text-center">
              Page {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <EnrollmentFormDialog
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditing(null);
        }}
        editing={editing}
        submitting={createMut.isPending || updateMut.isPending}
        onSubmit={handleSubmit}
      />

      <EnrollmentViewDrawer
        enrollment={viewing}
        onOpenChange={(o) => !o && setViewing(null)}
      />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete enrollment?"
        description={
          toDelete
            ? `This will remove ${toDelete.studentName}'s enrollment in ${toDelete.courseName}. This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => toDelete && deleteMut.mutate(toDelete.enrollmentId)}
      />

      <ConfirmDialog
        open={!!toComplete}
        onOpenChange={(o) => !o && setToComplete(null)}
        title="Complete enrollment?"
        description={
          toComplete
            ? `Mark ${toComplete.studentName}'s enrollment in ${toComplete.courseName} as completed.`
            : ""
        }
        confirmLabel="Complete"
        onConfirm={() => {
          if (toComplete) {
            completeMut.mutate(toComplete.enrollmentId);
            setToComplete(null);
          }
        }}
      />

      <ConfirmDialog
        open={!!toDrop}
        onOpenChange={(o) => !o && setToDrop(null)}
        title="Drop enrollment?"
        description={
          toDrop
            ? `Drop ${toDrop.studentName}'s enrollment in ${toDrop.courseName}.`
            : ""
        }
        confirmLabel="Drop"
        variant="destructive"
        onConfirm={() => {
          if (toDrop) {
            dropMut.mutate(toDrop.enrollmentId);
            setToDrop(null);
          }
        }}
      />
    </div>
  );
}
