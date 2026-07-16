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
  ClipboardCheck,
  UserCheck,
  UserX,
  Clock,
  CalendarCheck,
  CalendarDays,
  GraduationCap,
  BookOpen,
  Users,
  BarChart3,
  ListChecks,
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
import { teacherApi } from "@/features/teacher/api/teacherApi";
import { AttendanceFormDialog } from "../components/AttendanceFormDialog";
import { AttendanceViewDrawer } from "../components/AttendanceViewDrawer";
import { AttendanceStatusBadge } from "../components/AttendanceStatusBadge";
import {
  useAttendanceList,
  useCreateAttendance,
  useUpdateAttendance,
  useDeleteAttendance,
} from "../hooks/useAttendance";
import {
  ATTENDANCE_STATUSES,
  ATTENDANCE_STATUS_LABEL,
  type Attendance,
  type AttendanceRequest,
  type AttendanceStatus,
} from "../types";

const PAGE_SIZE = 10;

const todayIso = () => new Date().toISOString().slice(0, 10);

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "default" | "success" | "warning" | "danger" | "info";
}

function StatCard({ label, value, icon: Icon, tone = "default" }: StatCardProps) {
  const toneClass =
    tone === "success"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : tone === "danger"
        ? "bg-red-500/10 text-red-600 dark:text-red-400"
        : tone === "warning"
          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
          : tone === "info"
            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
            : "bg-primary/10 text-primary";
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-medium text-muted-foreground">{label}</div>
          <div className="mt-1 text-2xl font-semibold">{value}</div>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${toneClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

type SortKey = "attendanceId" | "studentName" | "subjectName" | "attendanceDate";

export default function AttendancePage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [studentFilter, setStudentFilter] = useState<string>("ALL");
  const [subjectFilter, setSubjectFilter] = useState<string>("ALL");
  const [teacherFilter, setTeacherFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("attendanceDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Attendance | null>(null);
  const [viewing, setViewing] = useState<Attendance | null>(null);
  const [toDelete, setToDelete] = useState<Attendance | null>(null);

  const listQuery = useAttendanceList();
  const studentsQuery = useQuery({
    queryKey: ["students"],
    queryFn: studentApi.list,
  });
  const subjectsQuery = useQuery({
    queryKey: ["subjects"],
    queryFn: subjectApi.list,
  });
  const teachersQuery = useQuery({
    queryKey: ["teachers"],
    queryFn: teacherApi.list,
  });

  const createMut = useCreateAttendance(() => {
    setFormOpen(false);
    setEditing(null);
  });
  const updateMut = useUpdateAttendance(() => {
    setFormOpen(false);
    setEditing(null);
  });
  const deleteMut = useDeleteAttendance(() => setToDelete(null));

  const records = listQuery.data ?? [];
  const today = todayIso();

  const stats = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let leave = 0;
    for (const r of records) {
      if (r.attendanceDate !== today) continue;
      if (r.status === "PRESENT") present++;
      else if (r.status === "ABSENT") absent++;
      else if (r.status === "LATE") late++;
      else if (r.status === "LEAVE") leave++;
    }
    return { total: records.length, present, absent, late, leave };
  }, [records, today]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const arr = records.filter((r) => {
      if (studentFilter !== "ALL" && String(r.studentId) !== studentFilter)
        return false;
      if (subjectFilter !== "ALL" && String(r.subjectId) !== subjectFilter)
        return false;
      if (
        teacherFilter !== "ALL" &&
        String(r.markedById ?? "") !== teacherFilter
      )
        return false;
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (dateFilter && r.attendanceDate !== dateFilter) return false;
      if (!q) return true;
      return (
        r.studentName.toLowerCase().includes(q) ||
        r.subjectName.toLowerCase().includes(q) ||
        (r.teacherName ?? "").toLowerCase().includes(q) ||
        r.attendanceDate.includes(q)
      );
    });
    const sorted = [...arr].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [
    records,
    query,
    studentFilter,
    subjectFilter,
    teacherFilter,
    statusFilter,
    dateFilter,
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
  const openEdit = (r: Attendance) => {
    setEditing(r);
    setFormOpen(true);
  };
  const handleSubmit = (payload: AttendanceRequest) => {
    if (editing) updateMut.mutate({ id: editing.attendanceId, data: payload });
    else createMut.mutate(payload);
  };

  const resetFilters = () => {
    setQuery("");
    setStudentFilter("ALL");
    setSubjectFilter("ALL");
    setTeacherFilter("ALL");
    setStatusFilter("ALL");
    setDateFilter("");
    setPage(1);
  };

  const hasFilters =
    !!query ||
    studentFilter !== "ALL" ||
    subjectFilter !== "ALL" ||
    teacherFilter !== "ALL" ||
    statusFilter !== "ALL" ||
    !!dateFilter;

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
        title="Attendance"
        description="Track and manage student attendance across subjects."
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
            <Button asChild variant="outline">
              <Link to="/attendance/bulk">
                <ListChecks className="mr-2 h-4 w-4" /> Bulk mark
              </Link>
            </Button>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" /> Mark attendance
            </Button>
          </div>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard
          label="Total records"
          value={stats.total}
          icon={ClipboardCheck}
        />
        <StatCard
          label="Present today"
          value={stats.present}
          icon={UserCheck}
          tone="success"
        />
        <StatCard
          label="Absent today"
          value={stats.absent}
          icon={UserX}
          tone="danger"
        />
        <StatCard
          label="Late today"
          value={stats.late}
          icon={Clock}
          tone="warning"
        />
        <StatCard
          label="Leave today"
          value={stats.leave}
          icon={CalendarCheck}
          tone="info"
        />
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Link
          to="/attendance/calendar"
          className="rounded-lg border bg-card p-4 transition hover:border-primary/60 hover:shadow-sm"
        >
          <CalendarDays className="mb-2 h-5 w-5 text-primary" />
          <div className="text-sm font-semibold">Calendar</div>
          <div className="text-xs text-muted-foreground">
            View attendance by date
          </div>
        </Link>
        <Link
          to="/attendance/student"
          className="rounded-lg border bg-card p-4 transition hover:border-primary/60 hover:shadow-sm"
        >
          <GraduationCap className="mb-2 h-5 w-5 text-primary" />
          <div className="text-sm font-semibold">Student history</div>
          <div className="text-xs text-muted-foreground">
            Attendance for a student
          </div>
        </Link>
        <Link
          to="/attendance/subject"
          className="rounded-lg border bg-card p-4 transition hover:border-primary/60 hover:shadow-sm"
        >
          <BookOpen className="mb-2 h-5 w-5 text-primary" />
          <div className="text-sm font-semibold">Subject history</div>
          <div className="text-xs text-muted-foreground">
            Attendance for a subject
          </div>
        </Link>
        <Link
          to="/attendance/teacher"
          className="rounded-lg border bg-card p-4 transition hover:border-primary/60 hover:shadow-sm"
        >
          <Users className="mb-2 h-5 w-5 text-primary" />
          <div className="text-sm font-semibold">Teacher history</div>
          <div className="text-xs text-muted-foreground">
            Records marked by a teacher
          </div>
        </Link>
        <Link
          to="/attendance/analytics"
          className="rounded-lg border bg-card p-4 transition hover:border-primary/60 hover:shadow-sm"
        >
          <BarChart3 className="mb-2 h-5 w-5 text-primary" />
          <div className="text-sm font-semibold">Analytics</div>
          <div className="text-xs text-muted-foreground">
            Charts and percentages
          </div>
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
            placeholder="Search student, subject, teacher, date..."
            className="pl-8"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setPage(1);
            }}
            className="w-[160px]"
          />
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              {ATTENDANCE_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {ATTENDANCE_STATUS_LABEL[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={studentFilter}
            onValueChange={(v) => {
              setStudentFilter(v);
              setPage(1);
            }}
          >
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
          <Select
            value={subjectFilter}
            onValueChange={(v) => {
              setSubjectFilter(v);
              setPage(1);
            }}
          >
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
          <Select
            value={teacherFilter}
            onValueChange={(v) => {
              setTeacherFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Teacher" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All teachers</SelectItem>
              {teachersQuery.data?.map((t) => (
                <SelectItem key={t.teacherId} value={String(t.teacherId)}>
                  {t.firstName} {t.lastName}
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
                <TableHead
                  className="w-[80px] cursor-pointer"
                  onClick={() => toggleSort("attendanceId")}
                >
                  ID
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => toggleSort("studentName")}
                >
                  Student
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => toggleSort("subjectName")}
                >
                  Subject
                </TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => toggleSort("attendanceDate")}
                >
                  Date
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[1%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No attendance records found.
                  </TableCell>
                </TableRow>
              ) : (
                pageData.map((r) => (
                  <TableRow key={r.attendanceId}>
                    <TableCell className="font-mono text-xs">
                      #{r.attendanceId}
                    </TableCell>
                    <TableCell className="font-medium">
                      {r.studentName}
                    </TableCell>
                    <TableCell>{r.subjectName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.teacherName ?? "—"}
                    </TableCell>
                    <TableCell>{r.attendanceDate}</TableCell>
                    <TableCell>
                      <AttendanceStatusBadge status={r.status} />
                    </TableCell>
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
                            className="text-destructive"
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

      {!listQuery.isLoading && !listQuery.isError && filtered.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {pageData.length} of {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="min-w-[80px] text-center">
              Page {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <AttendanceFormDialog
        open={formOpen}
        onOpenChange={(v) => {
          setFormOpen(v);
          if (!v) setEditing(null);
        }}
        editing={editing}
        submitting={createMut.isPending || updateMut.isPending}
        onSubmit={handleSubmit}
      />

      <AttendanceViewDrawer
        open={!!viewing}
        onOpenChange={(v) => !v && setViewing(null)}
        attendance={viewing}
      />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(null)}
        title="Delete attendance record?"
        description={
          toDelete
            ? `This will permanently delete attendance #${toDelete.attendanceId} for ${toDelete.studentName}.`
            : ""
        }
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() =>
          toDelete && deleteMut.mutate(toDelete.attendanceId)
        }
      />
    </div>
  );
}

// Helper types re-export for status filter typing readability
export type _AttStatus = AttendanceStatus;
