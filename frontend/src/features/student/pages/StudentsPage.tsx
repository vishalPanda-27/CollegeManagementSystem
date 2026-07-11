import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  MoreHorizontal,
  Power,
  PowerOff,
  Ban,
  GraduationCap,
  Users,
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
import { departmentsApi } from "@/api/departments";
import { StudentFormDialog } from "../components/StudentFormDialog";
import { StudentViewDrawer } from "../components/StudentViewDrawer";
import {
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
  useSetStudentStatus,
  useStudentCount,
  useStudentCountByStatus,
} from "../hooks/useStudents";
import {
  STUDENT_STATUSES,
  STUDENT_STATUS_LABEL,
  type Student,
  type StudentRequest,
  type StudentStatus,
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
  StudentStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  ACTIVE: "default",
  INACTIVE: "secondary",
  GRADUATED: "outline",
  SUSPENDED: "destructive",
};

interface PendingStatus {
  student: Student;
  status: StudentStatus;
}

export default function StudentsPage() {
  const [query, setQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [viewing, setViewing] = useState<Student | null>(null);
  const [toDelete, setToDelete] = useState<Student | null>(null);
  const [pendingStatus, setPendingStatus] = useState<PendingStatus | null>(null);

  const listQuery = useStudents();
  const departmentsQuery = useQuery({
    queryKey: ["departments"],
    queryFn: departmentsApi.list,
  });

  const totalCount = useStudentCount();
  const activeCount = useStudentCountByStatus("ACTIVE");
  const inactiveCount = useStudentCountByStatus("INACTIVE");
  const suspendedCount = useStudentCountByStatus("SUSPENDED");
  const graduatedCount = useStudentCountByStatus("GRADUATED");

  const createMut = useCreateStudent(() => {
    setFormOpen(false);
    setEditing(null);
  });
  const updateMut = useUpdateStudent(() => {
    setFormOpen(false);
    setEditing(null);
  });
  const deleteMut = useDeleteStudent(() => setToDelete(null));
  const statusMut = useSetStudentStatus();

  const students = listQuery.data ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((s) => {
      if (deptFilter !== "all" && String(s.departmentId) !== deptFilter)
        return false;
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (!q) return true;
      return (
        s.rollNumber.toLowerCase().includes(q) ||
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q) ||
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    });
  }, [students, query, deptFilter, statusFilter]);

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
  const openEdit = (s: Student) => {
    setEditing(s);
    setFormOpen(true);
  };

  const handleSubmit = (payload: StudentRequest) => {
    if (editing) updateMut.mutate({ id: editing.id, data: payload });
    else createMut.mutate(payload);
  };

  const statCards = [
    {
      label: "Total students",
      value: totalCount.data,
      loading: totalCount.isLoading,
      icon: Users,
      accent: "bg-primary/10 text-primary",
    },
    {
      label: "Active",
      value: activeCount.data,
      loading: activeCount.isLoading,
      icon: Power,
      accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Inactive",
      value: inactiveCount.data,
      loading: inactiveCount.isLoading,
      icon: PowerOff,
      accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      label: "Suspended",
      value: suspendedCount.data,
      loading: suspendedCount.isLoading,
      icon: Ban,
      accent: "bg-red-500/10 text-red-600 dark:text-red-400",
    },
    {
      label: "Graduated",
      value: graduatedCount.data,
      loading: graduatedCount.isLoading,
      icon: GraduationCap,
      accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Students"
        description="Manage student records, enrollment status, and department assignment."
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
              <Plus className="mr-2 h-4 w-4" /> Add student
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
              {c.loading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <div className="text-2xl font-bold">{c.value ?? 0}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by roll no, name, or email..."
              className="pl-8"
            />
          </div>
          <Select
            value={deptFilter}
            onValueChange={(v) => {
              setDeptFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All departments</SelectItem>
              {departmentsQuery.data?.map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              {STUDENT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {STUDENT_STATUS_LABEL[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-xs text-muted-foreground">
          {filtered.length} student{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[70px]">ID</TableHead>
              <TableHead>Roll no.</TableHead>
              <TableHead>Full name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Admission</TableHead>
              <TableHead className="w-[70px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listQuery.isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  {Array.from({ length: 10 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : listQuery.isError ? (
              <TableRow>
                <TableCell colSpan={10} className="py-10">
                  <ErrorState onRetry={() => listQuery.refetch()} />
                </TableCell>
              </TableRow>
            ) : pageData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="py-16">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <UserCircle className="h-6 w-6" />
                    </div>
                    <div className="text-sm font-medium">
                      {query || deptFilter !== "all" || statusFilter !== "all"
                        ? "No matching students"
                        : "No students yet"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {query || deptFilter !== "all" || statusFilter !== "all"
                        ? "Try adjusting the filters."
                        : "Add your first student to get started."}
                    </div>
                    {!query &&
                      deptFilter === "all" &&
                      statusFilter === "all" && (
                        <Button size="sm" className="mt-2" onClick={openCreate}>
                          <Plus className="mr-2 h-4 w-4" /> Add student
                        </Button>
                      )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              pageData.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.id}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {s.rollNumber}
                  </TableCell>
                  <TableCell className="font-medium">
                    {s.firstName} {s.lastName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {s.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {s.phoneNumber}
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">
                    {s.gender?.toLowerCase() || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {s.departmentName ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[s.status]}>
                      {STUDENT_STATUS_LABEL[s.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(s.admissionDate)}
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
                        <DropdownMenuItem onClick={() => setViewing(s)}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEdit(s)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {STUDENT_STATUSES.filter((st) => st !== s.status).map(
                          (st) => {
                            const Icon =
                              st === "ACTIVE"
                                ? Power
                                : st === "INACTIVE"
                                ? PowerOff
                                : st === "SUSPENDED"
                                ? Ban
                                : GraduationCap;
                            return (
                              <DropdownMenuItem
                                key={st}
                                onClick={() =>
                                  setPendingStatus({ student: s, status: st })
                                }
                              >
                                <Icon className="mr-2 h-4 w-4" />
                                Mark as {STUDENT_STATUS_LABEL[st]}
                              </DropdownMenuItem>
                            );
                          },
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setToDelete(s)}
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

      <StudentFormDialog
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditing(null);
        }}
        editing={editing}
        submitting={createMut.isPending || updateMut.isPending}
        onSubmit={handleSubmit}
      />

      <StudentViewDrawer
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
        student={viewing}
      />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete student?"
        description={`This will permanently delete "${
          toDelete ? `${toDelete.firstName} ${toDelete.lastName}` : ""
        }". This action cannot be undone.`}
        confirmLabel={deleteMut.isPending ? "Deleting..." : "Delete"}
        variant="destructive"
        onConfirm={() => toDelete && deleteMut.mutate(toDelete.id)}
      />

      <ConfirmDialog
        open={!!pendingStatus}
        onOpenChange={(o) => !o && setPendingStatus(null)}
        title="Change student status?"
        description={
          pendingStatus
            ? `Set "${pendingStatus.student.firstName} ${pendingStatus.student.lastName}" to ${STUDENT_STATUS_LABEL[pendingStatus.status]}.`
            : ""
        }
        confirmLabel={statusMut.isPending ? "Updating..." : "Confirm"}
        onConfirm={() => {
          if (pendingStatus) {
            statusMut.mutate(
              {
                id: pendingStatus.student.id,
                status: pendingStatus.status,
              },
              { onSettled: () => setPendingStatus(null) },
            );
          }
        }}
      />
    </div>
  );
}
