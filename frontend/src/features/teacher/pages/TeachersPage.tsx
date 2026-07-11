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
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ErrorState } from "@/components/common/ErrorState";
import { departmentsApi } from "@/api/departments";
import { TeacherFormDialog } from "../components/TeacherFormDialog";
import { TeacherViewDrawer } from "../components/TeacherViewDrawer";
import {
  useTeachers,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher,
  useSetTeacherStatus,
} from "../hooks/useTeachers";
import type { Teacher, TeacherRequest } from "../types";

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

type StatusFilter = "all" | "active" | "inactive";

export default function TeachersPage() {
  const [query, setQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [viewing, setViewing] = useState<Teacher | null>(null);
  const [toDelete, setToDelete] = useState<Teacher | null>(null);

  const listQuery = useTeachers();
  const departmentsQuery = useQuery({
    queryKey: ["departments"],
    queryFn: departmentsApi.list,
  });

  const createMut = useCreateTeacher(() => {
    setFormOpen(false);
    setEditing(null);
  });
  const updateMut = useUpdateTeacher(() => {
    setFormOpen(false);
    setEditing(null);
  });
  const deleteMut = useDeleteTeacher(() => setToDelete(null));
  const statusMut = useSetTeacherStatus();

  const teachers = listQuery.data ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return teachers.filter((t) => {
      if (deptFilter !== "all" && String(t.departmentId) !== deptFilter)
        return false;
      if (statusFilter === "active" && !t.active) return false;
      if (statusFilter === "inactive" && t.active) return false;
      if (!q) return true;
      return (
        t.firstName.toLowerCase().includes(q) ||
        t.lastName.toLowerCase().includes(q) ||
        `${t.firstName} ${t.lastName}`.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q)
      );
    });
  }, [teachers, query, deptFilter, statusFilter]);

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
  const openEdit = (t: Teacher) => {
    setEditing(t);
    setFormOpen(true);
  };

  const handleSubmit = (payload: TeacherRequest) => {
    if (editing)
      updateMut.mutate({ id: editing.teacherId, data: payload });
    else createMut.mutate(payload);
  };

  return (
    <div>
      <PageHeader
        title="Teachers"
        description="Manage faculty profiles, assignments, and status."
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
              <Plus className="mr-2 h-4 w-4" /> Add teacher
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name or email..."
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
            onValueChange={(v: StatusFilter) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-xs text-muted-foreground">
          {filtered.length} teacher{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[70px]">ID</TableHead>
              <TableHead>Full name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Qualification</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
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
                        ? "No matching teachers"
                        : "No teachers yet"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {query || deptFilter !== "all" || statusFilter !== "all"
                        ? "Try adjusting the filters."
                        : "Add your first teacher to get started."}
                    </div>
                    {!query &&
                      deptFilter === "all" &&
                      statusFilter === "all" && (
                        <Button size="sm" className="mt-2" onClick={openCreate}>
                          <Plus className="mr-2 h-4 w-4" /> Add teacher
                        </Button>
                      )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              pageData.map((t) => (
                <TableRow key={t.teacherId}>
                  <TableCell className="font-mono text-xs">
                    {t.teacherId}
                  </TableCell>
                  <TableCell className="font-medium">
                    {t.firstName} {t.lastName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {t.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {t.phone}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {t.qualification}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {t.specialization}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {t.departmentName ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={t.active ? "default" : "secondary"}>
                      {t.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(t.joiningDate)}
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
                        <DropdownMenuItem onClick={() => setViewing(t)}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEdit(t)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        {t.active ? (
                          <DropdownMenuItem
                            onClick={() =>
                              statusMut.mutate({
                                id: t.teacherId,
                                active: false,
                              })
                            }
                          >
                            <PowerOff className="mr-2 h-4 w-4" /> Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() =>
                              statusMut.mutate({
                                id: t.teacherId,
                                active: true,
                              })
                            }
                          >
                            <Power className="mr-2 h-4 w-4" /> Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setToDelete(t)}
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

      <TeacherFormDialog
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditing(null);
        }}
        editing={editing}
        submitting={createMut.isPending || updateMut.isPending}
        onSubmit={handleSubmit}
      />

      <TeacherViewDrawer
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
        teacher={viewing}
      />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete teacher?"
        description={`This will permanently delete "${
          toDelete ? `${toDelete.firstName} ${toDelete.lastName}` : ""
        }". This action cannot be undone.`}
        confirmLabel={deleteMut.isPending ? "Deleting..." : "Delete"}
        variant="destructive"
        onConfirm={() => toDelete && deleteMut.mutate(toDelete.teacherId)}
      />
    </div>
  );
}
