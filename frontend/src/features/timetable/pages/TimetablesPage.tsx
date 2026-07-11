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
  CalendarDays,
  Table as TableIcon,
  Users,
  BookOpen,
  DoorOpen,
  CalendarClock,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { courseApi } from "@/features/course/api/courseApi";
import { teacherApi } from "@/features/teacher/api/teacherApi";
import { classroomApi } from "@/features/classroom/api/classroomApi";
import { TimetableFormDialog } from "../components/TimetableFormDialog";
import { TimetableViewDrawer } from "../components/TimetableViewDrawer";
import { WeeklyTimetableGrid } from "../components/WeeklyTimetableGrid";
import {
  useTimetables,
  useCreateTimetable,
  useUpdateTimetable,
  useDeleteTimetable,
  useTimetableCount,
} from "../hooks/useTimetables";
import {
  DAYS_OF_WEEK,
  DAY_LABELS,
  type DayOfWeek,
  type Timetable,
  type TimetableRequest,
} from "../types";

const PAGE_SIZE = 10;

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

function fmtTime(t?: string) {
  if (!t) return "—";
  return t.length >= 5 ? t.slice(0, 5) : t;
}

export default function TimetablesPage() {
  const [view, setView] = useState<"week" | "table">("week");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [dayFilter, setDayFilter] = useState<DayOfWeek | "ALL">("ALL");
  const [teacherFilter, setTeacherFilter] = useState<string>("ALL");
  const [classroomFilter, setClassroomFilter] = useState<string>("ALL");
  const [courseFilter, setCourseFilter] = useState<string>("ALL");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Timetable | null>(null);
  const [viewing, setViewing] = useState<Timetable | null>(null);
  const [toDelete, setToDelete] = useState<Timetable | null>(null);

  const listQuery = useTimetables();
  const countQuery = useTimetableCount();
  const teachersQuery = useQuery({
    queryKey: ["teachers"],
    queryFn: teacherApi.list,
  });
  const classroomsQuery = useQuery({
    queryKey: ["classrooms"],
    queryFn: classroomApi.list,
  });
  const coursesQuery = useQuery({
    queryKey: ["courses"],
    queryFn: courseApi.list,
  });

  const createMut = useCreateTimetable(() => {
    setFormOpen(false);
    setEditing(null);
  });
  const updateMut = useUpdateTimetable(() => {
    setFormOpen(false);
    setEditing(null);
  });
  const deleteMut = useDeleteTimetable(() => setToDelete(null));

  const timetables = listQuery.data ?? [];

  const stats = useMemo(() => {
    const total = timetables.length;
    const courses = new Set<number>();
    const teachers = new Set<number>();
    const classrooms = new Set<number>();
    for (const t of timetables) {
      courses.add(t.courseId);
      teachers.add(t.teacherId);
      classrooms.add(t.classroomId);
    }
    return {
      total,
      courses: courses.size,
      teachers: teachers.size,
      classrooms: classrooms.size,
    };
  }, [timetables]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return timetables.filter((t) => {
      if (dayFilter !== "ALL" && t.dayOfWeek !== dayFilter) return false;
      if (teacherFilter !== "ALL" && String(t.teacherId) !== teacherFilter)
        return false;
      if (classroomFilter !== "ALL" && String(t.classroomId) !== classroomFilter)
        return false;
      if (courseFilter !== "ALL" && String(t.courseId) !== courseFilter)
        return false;
      if (!q) return true;
      return (
        (t.subjectName ?? "").toLowerCase().includes(q) ||
        (t.courseName ?? "").toLowerCase().includes(q) ||
        (t.teacherName ?? "").toLowerCase().includes(q) ||
        (t.classroomName ?? "").toLowerCase().includes(q)
      );
    });
  }, [timetables, query, dayFilter, teacherFilter, classroomFilter, courseFilter]);

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
  const openEdit = (t: Timetable) => {
    setEditing(t);
    setFormOpen(true);
  };
  const handleSubmit = (payload: TimetableRequest) => {
    if (editing) updateMut.mutate({ id: editing.timetableId, data: payload });
    else createMut.mutate(payload);
  };

  const resetFilters = () => {
    setQuery("");
    setDayFilter("ALL");
    setTeacherFilter("ALL");
    setClassroomFilter("ALL");
    setCourseFilter("ALL");
    setPage(1);
  };

  const hasFilters =
    !!query ||
    dayFilter !== "ALL" ||
    teacherFilter !== "ALL" ||
    classroomFilter !== "ALL" ||
    courseFilter !== "ALL";

  return (
    <div>
      <PageHeader
        title="Timetable"
        description="Manage the weekly academic schedule across courses, subjects, teachers, and classrooms."
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
              <Plus className="mr-2 h-4 w-4" /> Add entry
            </Button>
          </div>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Total entries"
          value={countQuery.data ?? stats.total}
          icon={CalendarClock}
        />
        <StatCard
          label="Scheduled courses"
          value={stats.courses}
          icon={BookOpen}
          tone="success"
        />
        <StatCard
          label="Assigned teachers"
          value={stats.teachers}
          icon={Users}
          tone="muted"
        />
        <StatCard
          label="Occupied classrooms"
          value={stats.classrooms}
          icon={DoorOpen}
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
            placeholder="Search subject, course, teacher, classroom..."
            className="pl-8"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={dayFilter}
            onValueChange={(v) => {
              setDayFilter(v as DayOfWeek | "ALL");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All days</SelectItem>
              {DAYS_OF_WEEK.map((d) => (
                <SelectItem key={d} value={d}>
                  {DAY_LABELS[d]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={courseFilter}
            onValueChange={(v) => {
              setCourseFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All courses</SelectItem>
              {coursesQuery.data?.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.courseName}
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

          <Select
            value={classroomFilter}
            onValueChange={(v) => {
              setClassroomFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Classroom" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All classrooms</SelectItem>
              {classroomsQuery.data?.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.roomNumber} — {c.buildingName}
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

      <Tabs value={view} onValueChange={(v) => setView(v as "week" | "table")}>
        <TabsList>
          <TabsTrigger value="week">
            <CalendarDays className="mr-2 h-4 w-4" /> Weekly view
          </TabsTrigger>
          <TabsTrigger value="table">
            <TableIcon className="mr-2 h-4 w-4" /> Table view
          </TabsTrigger>
        </TabsList>

        <TabsContent value="week" className="mt-4">
          {listQuery.isLoading ? (
            <Skeleton className="h-[600px] w-full" />
          ) : listQuery.isError ? (
            <ErrorState onRetry={() => listQuery.refetch()} />
          ) : (
            <WeeklyTimetableGrid
              timetables={filtered}
              onSelect={(t) => setViewing(t)}
            />
          )}
        </TabsContent>

        <TabsContent value="table" className="mt-4">
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70px]">ID</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Classroom</TableHead>
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
                          <CalendarClock className="h-6 w-6" />
                        </div>
                        <div className="text-sm font-medium">
                          {hasFilters
                            ? "No matching entries"
                            : "No timetable entries yet"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {hasFilters
                            ? "Try adjusting your filters."
                            : "Create your first timetable entry."}
                        </div>
                        {!hasFilters && (
                          <Button size="sm" className="mt-2" onClick={openCreate}>
                            <Plus className="mr-2 h-4 w-4" /> Add entry
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  pageData.map((t) => (
                    <TableRow key={t.timetableId}>
                      <TableCell className="font-mono text-xs">
                        {t.timetableId}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {DAY_LABELS[t.dayOfWeek]}
                        </Badge>
                      </TableCell>
                      <TableCell>{fmtTime(t.startTime)}</TableCell>
                      <TableCell>{fmtTime(t.endTime)}</TableCell>
                      <TableCell>
                        {t.courseName ?? `#${t.courseId}`}
                      </TableCell>
                      <TableCell className="font-medium">
                        {t.subjectName ?? `#${t.subjectId}`}
                      </TableCell>
                      <TableCell>
                        {t.teacherName ?? `#${t.teacherId}`}
                      </TableCell>
                      <TableCell>
                        {t.classroomName ?? `#${t.classroomId}`}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
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

          {filtered.length > 0 && (
            <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
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
                <span className="min-w-[70px] text-center">
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
        </TabsContent>
      </Tabs>

      <TimetableFormDialog
        open={formOpen}
        onOpenChange={(v) => {
          setFormOpen(v);
          if (!v) setEditing(null);
        }}
        editing={editing}
        onSubmit={handleSubmit}
        submitting={createMut.isPending || updateMut.isPending}
      />

      <TimetableViewDrawer
        open={!!viewing}
        onOpenChange={(v) => !v && setViewing(null)}
        timetable={viewing}
      />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(null)}
        title="Delete timetable entry?"
        description={
          toDelete
            ? `This will remove the ${DAY_LABELS[toDelete.dayOfWeek]} ${fmtTime(
                toDelete.startTime,
              )} entry for ${toDelete.subjectName ?? "this subject"}.`
            : ""
        }
        confirmLabel={deleteMut.isPending ? "Deleting..." : "Delete"}
        variant="destructive"
        onConfirm={() => toDelete && deleteMut.mutate(toDelete.timetableId)}
      />
    </div>
  );
}
