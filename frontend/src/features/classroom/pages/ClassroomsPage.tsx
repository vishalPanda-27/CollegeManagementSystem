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
  DoorOpen,
  MoreHorizontal,
  Building2,
  CircleCheck,
  CircleDot,
  Wrench,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorState } from "@/components/common/ErrorState";
import { departmentsApi } from "@/api/departments";
import { ClassroomFormDialog } from "../components/ClassroomFormDialog";
import { ClassroomViewDrawer } from "../components/ClassroomViewDrawer";
import {
  useClassrooms,
  useCreateClassroom,
  useUpdateClassroom,
  useDeleteClassroom,
  useChangeClassroomStatus,
} from "../hooks/useClassrooms";
import {
  ROOM_STATUSES,
  ROOM_STATUS_LABELS,
  ROOM_TYPES,
  ROOM_TYPE_LABELS,
  type Classroom,
  type ClassroomRequest,
  type RoomStatus,
  type RoomType,
} from "../types";

const PAGE_SIZE = 10;

const statusVariant: Record<RoomStatus, "default" | "secondary" | "destructive"> = {
  AVAILABLE: "default",
  OCCUPIED: "secondary",
  MAINTENANCE: "destructive",
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

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "default" | "success" | "warning" | "muted";
}

function StatCard({ label, value, icon: Icon, tone = "default" }: StatCardProps) {
  const toneClass =
    tone === "success"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : tone === "warning"
        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
        : tone === "muted"
          ? "bg-muted text-muted-foreground"
          : "bg-primary/10 text-primary";
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-medium text-muted-foreground">
            {label}
          </div>
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

export default function ClassroomsPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<RoomType | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<RoomStatus | "ALL">("ALL");
  const [deptFilter, setDeptFilter] = useState<string>("ALL");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Classroom | null>(null);
  const [viewing, setViewing] = useState<Classroom | null>(null);
  const [toDelete, setToDelete] = useState<Classroom | null>(null);

  const listQuery = useClassrooms();
  const departmentsQuery = useQuery({
    queryKey: ["departments"],
    queryFn: departmentsApi.list,
  });

  const createMut = useCreateClassroom(() => {
    setFormOpen(false);
    setEditing(null);
  });
  const updateMut = useUpdateClassroom(() => {
    setFormOpen(false);
    setEditing(null);
  });
  const deleteMut = useDeleteClassroom(() => setToDelete(null));
  const statusMut = useChangeClassroomStatus();

  const classrooms = listQuery.data ?? [];

  const stats = useMemo(() => {
    const total = classrooms.length;
    let available = 0;
    let occupied = 0;
    let maintenance = 0;
    for (const c of classrooms) {
      if (c.status === "AVAILABLE") available++;
      else if (c.status === "OCCUPIED") occupied++;
      else if (c.status === "MAINTENANCE") maintenance++;
    }
    return { total, available, occupied, maintenance };
  }, [classrooms]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return classrooms.filter((c) => {
      if (typeFilter !== "ALL" && c.roomType !== typeFilter) return false;
      if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
      if (deptFilter !== "ALL") {
        if (deptFilter === "NONE" && c.departmentId) return false;
        if (deptFilter !== "NONE" && String(c.departmentId ?? "") !== deptFilter)
          return false;
      }
      if (!q) return true;
      return (
        c.roomNumber.toLowerCase().includes(q) ||
        c.buildingName.toLowerCase().includes(q)
      );
    });
  }, [classrooms, query, typeFilter, statusFilter, deptFilter]);

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
  const openEdit = (c: Classroom) => {
    setEditing(c);
    setFormOpen(true);
  };

  const handleSubmit = (payload: ClassroomRequest) => {
    if (editing) updateMut.mutate({ id: editing.id, data: payload });
    else createMut.mutate(payload);
  };

  const resetFilters = () => {
    setQuery("");
    setTypeFilter("ALL");
    setStatusFilter("ALL");
    setDeptFilter("ALL");
    setPage(1);
  };

  return (
    <div>
      <PageHeader
        title="Classrooms"
        description="Manage classrooms across buildings, types, and departments."
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
              <Plus className="mr-2 h-4 w-4" /> Add classroom
            </Button>
          </div>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Total classrooms"
          value={stats.total}
          icon={DoorOpen}
        />
        <StatCard
          label="Available"
          value={stats.available}
          icon={CircleCheck}
          tone="success"
        />
        <StatCard
          label="Occupied"
          value={stats.occupied}
          icon={CircleDot}
          tone="muted"
        />
        <StatCard
          label="Under maintenance"
          value={stats.maintenance}
          icon={Wrench}
          tone="warning"
        />
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
            placeholder="Search by room or building..."
            className="pl-8"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={typeFilter}
            onValueChange={(v) => {
              setTypeFilter(v as RoomType | "ALL");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Room type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All types</SelectItem>
              {ROOM_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {ROOM_TYPE_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v as RoomStatus | "ALL");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              {ROOM_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {ROOM_STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={deptFilter}
            onValueChange={(v) => {
              setDeptFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[190px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All departments</SelectItem>
              <SelectItem value="NONE">Unassigned</SelectItem>
              {departmentsQuery.data?.map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(query ||
            typeFilter !== "ALL" ||
            statusFilter !== "ALL" ||
            deptFilter !== "ALL") && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[70px]">ID</TableHead>
              <TableHead>Room #</TableHead>
              <TableHead>Building</TableHead>
              <TableHead>Floor</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Department</TableHead>
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
                      <DoorOpen className="h-6 w-6" />
                    </div>
                    <div className="text-sm font-medium">
                      {query ||
                      typeFilter !== "ALL" ||
                      statusFilter !== "ALL" ||
                      deptFilter !== "ALL"
                        ? "No matching classrooms"
                        : "No classrooms yet"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {query ||
                      typeFilter !== "ALL" ||
                      statusFilter !== "ALL" ||
                      deptFilter !== "ALL"
                        ? "Try adjusting your filters."
                        : "Create your first classroom to get started."}
                    </div>
                    {!query &&
                      typeFilter === "ALL" &&
                      statusFilter === "ALL" &&
                      deptFilter === "ALL" && (
                        <Button
                          size="sm"
                          className="mt-2"
                          onClick={openCreate}
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add classroom
                        </Button>
                      )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              pageData.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs">{c.id}</TableCell>
                  <TableCell className="font-medium">
                    <Badge variant="secondary" className="font-mono">
                      {c.roomNumber}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      {c.buildingName}
                    </div>
                  </TableCell>
                  <TableCell>{c.floor ?? "—"}</TableCell>
                  <TableCell>{c.capacity}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {ROOM_TYPE_LABELS[c.roomType]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={c.status}
                      onValueChange={(v) =>
                        statusMut.mutate({
                          id: c.id,
                          status: v as RoomStatus,
                        })
                      }
                    >
                      <SelectTrigger className="h-8 w-[140px]">
                        <Badge
                          variant={statusVariant[c.status]}
                          className="border-0"
                        >
                          {ROOM_STATUS_LABELS[c.status]}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {ROOM_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {ROOM_STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.departmentName ?? "—"}
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
                        <DropdownMenuItem onClick={() => setViewing(c)}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEdit(c)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                          Change status
                        </DropdownMenuLabel>
                        {ROOM_STATUSES.map((s) => (
                          <DropdownMenuItem
                            key={s}
                            disabled={s === c.status}
                            onClick={() =>
                              statusMut.mutate({ id: c.id, status: s })
                            }
                          >
                            {ROOM_STATUS_LABELS[s]}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setToDelete(c)}
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

      <ClassroomFormDialog
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditing(null);
        }}
        editing={editing}
        submitting={createMut.isPending || updateMut.isPending}
        onSubmit={handleSubmit}
      />

      <ClassroomViewDrawer
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
        classroom={viewing}
      />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete classroom?"
        description={`This will permanently delete room "${toDelete?.roomNumber}" in ${toDelete?.buildingName}. This action cannot be undone.`}
        confirmLabel={deleteMut.isPending ? "Deleting..." : "Delete"}
        variant="destructive"
        onConfirm={() => toDelete && deleteMut.mutate(toDelete.id)}
      />
    </div>
  );
}
