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
  DoorOpen,
  CalendarClock,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";
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
import { teacherApi } from "@/features/teacher/api/teacherApi";
import { classroomApi } from "@/features/classroom/api/classroomApi";
import { ScheduleFormDialog } from "../components/ScheduleFormDialog";
import { ScheduleViewDrawer } from "../components/ScheduleViewDrawer";
import { WeeklyScheduleGrid } from "../components/WeeklyScheduleGrid";
import {
  useClassSchedules,
  useCreateClassSchedule,
  useUpdateClassSchedule,
  useDeleteClassSchedule,
} from "../hooks/useClassSchedules";
import {
  DAYS_OF_WEEK,
  DAY_LABELS,
  type ClassSchedule,
  type ClassScheduleRequest,
  type DayOfWeek,
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

function fmtTime(t?: string) {
  if (!t) return "—";
  return t.length >= 5 ? t.slice(0, 5) : t;
}

const JS_DAY_TO_ENUM: Record<number, DayOfWeek> = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

export default function ClassSchedulesPage() {
  const [view, setView] = useState<"week" | "table">("week");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [dayFilter, setDayFilter] = useState<DayOfWeek | "ALL">("ALL");
  const [teacherFilter, setTeacherFilter] = useState<string>("ALL");
  const [classroomFilter, setClassroomFilter] = useState<string>("ALL");
  const [semesterFilter, setSemesterFilter] = useState<string>("ALL");
  const [yearFilter, setYearFilter] = useState<string>("ALL");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ClassSchedule | null>(null);
  const [viewing, setViewing] = useState<ClassSchedule | null>(null);
  const [toDelete, setToDelete] = useState<ClassSchedule | null>(null);

  const listQuery = useClassSchedules();
  const teachersQuery = useQuery({
    queryKey: ["teachers"],
    queryFn: teacherApi.list,
  });
  const classroomsQuery = useQuery({
    queryKey: ["classrooms"],
    queryFn: classroomApi.list,
  });

  const createMut = useCreateClassSchedule(() => {
    setFormOpen(false);
    setEditing(null);
  });
  const updateMut = useUpdateClassSchedule(() => {
    setFormOpen(false);
    setEditing(null);
  });
  const deleteMut = useDeleteClassSchedule(() => setToDelete(null));

  const schedules = listQuery.data ?? [];

  const todayEnum = JS_DAY_TO_ENUM[new Date().getDay()];

  const stats = useMemo(() => {
    const teachers = new Set<number>();
    const classrooms = new Set<number>();
    let today = 0;
    for (const s of schedules) {
      teachers.add(s.teacherId);
      classrooms.add(s.classroomId);
      if (s.dayOfWeek === todayEnum) today++;
    }
    return {
      total: schedules.length,
      teachers: teachers.size,
      classrooms: classrooms.size,
      today,
    };
  }, [schedules, todayEnum]);

  const semesters = useMemo(() => {
    const set = new Set<string>();
    for (const s of schedules) if (s.semester) set.add(s.semester);
    return Array.from(set).sort();
  }, [schedules]);
  const years = useMemo(() => {
    const set = new Set<string>();
    for (const s of schedules) if (s.academicYear) set.add(s.academicYear);
    return Array.from(set).sort();
  }, [schedules]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return schedules.filter((s) => {
      if (dayFilter !== "ALL" && s.dayOfWeek !== dayFilter) return false;
      if (teacherFilter !== "ALL" && String(s.teacherId) !== teacherFilter)
        return false;
      if (classroomFilter !== "ALL" && String(s.classroomId) !== classroomFilter)
        return false;
      if (semesterFilter !== "ALL" && (s.semester ?? "") !== semesterFilter)
        return false;
      if (yearFilter !== "ALL" && (s.academicYear ?? "") !== yearFilter)
        return false;
      if (!q) return true;
      return (
        (s.subjectName ?? "").toLowerCase().includes(q) ||
        (s.teacherName ?? "").toLowerCase().includes(q) ||
        (s.classroomName ?? "").toLowerCase().includes(q) ||
        (s.semester ?? "").toLowerCase().includes(q)
      );
    });
  }, [
    schedules,
    query,
    dayFilter,
    teacherFilter,
    classroomFilter,
    semesterFilter,
    yearFilter,
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
  const openEdit = (s: ClassSchedule) => {
    setEditing(s);
    setFormOpen(true);
  };
  const handleSubmit = (payload: ClassScheduleRequest) => {
    if (editing) updateMut.mutate({ id: editing.scheduleId, data: payload });
    else createMut.mutate(payload);
  };

  const resetFilters = () => {
    setQuery("");
    setDayFilter("ALL");
    setTeacherFilter("ALL");
    setClassroomFilter("ALL");
    setSemesterFilter("ALL");
    setYearFilter("ALL");
    setPage(1);
  };

  const hasFilters =
    !!query ||
    dayFilter !== "ALL" ||
    teacherFilter !== "ALL" ||
    classroomFilter !== "ALL" ||
    semesterFilter !== "ALL" ||
    yearFilter !== "ALL";

  return (
    <div>
      <PageHeader
        title="Class Schedule"
        description="Manage the weekly teaching schedule across teachers, subjects, and classrooms."
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
              <Plus className="mr-2 h-4 w-4" /> Add schedule
            </Button>
          </div>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Total schedules"
          value={stats.total}
          icon={CalendarClock}
        />
        <StatCard
          label="Teachers scheduled"
          value={stats.teachers}
          icon={Users}
          tone="success"
        />
        <StatCard
          label="Classrooms scheduled"
          value={stats.classrooms}
          icon={DoorOpen}
          tone="warning"
        />
        <StatCard
          label="Today's classes"
          value={stats.today}
          icon={CalendarDays}
          tone="muted"
        />
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          to="/schedules/teacher"
          className="rounded-lg border bg-card p-4 transition hover:border-primary/60 hover:shadow-sm"
        >
          <Users className="mb-2 h-5 w-5 text-primary" />
          <div className="text-sm font-semibold">Teacher schedule</div>
          <div className="text-xs text-muted-foreground">
            View a teacher's weekly schedule
          </div>
        </Link>
        <Link
          to="/schedules/classroom"
          className="rounded-lg border bg-card p-4 transition hover:border-primary/60 hover:shadow-sm"
        >
          <DoorOpen className="mb-2 h-5 w-5 text-primary" />
          <div className="text-sm font-semibold">Classroom schedule</div>
          <div className="text-xs text-muted-foreground">
            View bookings for a classroom
          </div>
        </Link>
        <Link
          to="/schedules/day"
          className="rounded-lg border bg-card p-4 transition hover:border-primary/60 hover:shadow-sm"
        >
          <CalendarDays className="mb-2 h-5 w-5 text-primary" />
          <div className="text-sm font-semibold">Daily schedule</div>
          <div className="text-xs text-muted-foreground">
            Browse all classes for a day
          </div>
        </Link>
        <Link
          to="/schedules/student"
          className="rounded-lg border bg-card p-4 transition hover:border-primary/60 hover:shadow-sm"
        >
          <GraduationCap className="mb-2 h-5 w-5 text-primary" />
          <div className="text-sm font-semibold">Student schedule</div>
          <div className="text-xs text-muted-foreground">
            View a student's weekly timetable
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
            placeholder="Search teacher, subject, classroom, semester..."
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
            <SelectTrigger className="w-[140px]">
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

          {semesters.length > 0 && (
            <Select
              value={semesterFilter}
              onValueChange={(v) => {
                setSemesterFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All semesters</SelectItem>
                {semesters.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {years.length > 0 && (
            <Select
              value={yearFilter}
              onValueChange={(v) => {
                setYearFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All years</SelectItem>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

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
            <WeeklyScheduleGrid
              schedules={filtered}
              onSelect={(s) => setViewing(s)}
            />
          )}
        </TabsContent>

        <TabsContent value="table" className="mt-4">
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70px]">ID</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Classroom</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Year</TableHead>
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
                          <CalendarClock className="h-6 w-6" />
                        </div>
                        <div className="text-sm font-medium">
                          {hasFilters
                            ? "No matching schedules"
                            : "No schedules yet"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {hasFilters
                            ? "Try adjusting your filters."
                            : "Create your first class schedule."}
                        </div>
                        {!hasFilters && (
                          <Button size="sm" className="mt-2" onClick={openCreate}>
                            <Plus className="mr-2 h-4 w-4" /> Add schedule
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  pageData.map((s) => (
                    <TableRow key={s.scheduleId}>
                      <TableCell className="font-mono text-xs">
                        {s.scheduleId}
                      </TableCell>
                      <TableCell>
                        {s.teacherName ?? `#${s.teacherId}`}
                      </TableCell>
                      <TableCell className="font-medium">
                        {s.subjectName ?? `#${s.subjectId}`}
                      </TableCell>
                      <TableCell>
                        {s.classroomName ?? `#${s.classroomId}`}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {DAY_LABELS[s.dayOfWeek]}
                        </Badge>
                      </TableCell>
                      <TableCell>{fmtTime(s.startTime)}</TableCell>
                      <TableCell>{fmtTime(s.endTime)}</TableCell>
                      <TableCell>{s.semester ?? "—"}</TableCell>
                      <TableCell>{s.academicYear ?? "—"}</TableCell>
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
                            <DropdownMenuItem onClick={() => setViewing(s)}>
                              <Eye className="mr-2 h-4 w-4" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(s)}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
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
                Prev
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
        </TabsContent>
      </Tabs>

      <ScheduleFormDialog
        open={formOpen}
        onOpenChange={(v) => {
          setFormOpen(v);
          if (!v) setEditing(null);
        }}
        editing={editing}
        submitting={createMut.isPending || updateMut.isPending}
        onSubmit={handleSubmit}
      />

      <ScheduleViewDrawer
        open={!!viewing}
        onOpenChange={(v) => !v && setViewing(null)}
        schedule={viewing}
      />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(null)}
        title="Delete schedule?"
        description={`This will permanently delete schedule #${toDelete?.scheduleId}.`}
        confirmLabel={deleteMut.isPending ? "Deleting..." : "Delete"}
        variant="destructive"
        onConfirm={() => toDelete && deleteMut.mutate(toDelete.scheduleId)}
      />
    </div>
  );
}
