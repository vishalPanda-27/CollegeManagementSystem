import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Search, CalendarDays, Table as TableIcon } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { ErrorState } from "@/components/common/ErrorState";
import { teacherApi } from "@/features/teacher/api/teacherApi";
import { WeeklyScheduleGrid } from "../components/WeeklyScheduleGrid";
import { ScheduleViewDrawer } from "../components/ScheduleViewDrawer";
import { useSchedulesByTeacher } from "../hooks/useClassSchedules";
import { DAY_LABELS, type ClassSchedule } from "../types";

function fmtTime(t?: string) {
  if (!t) return "—";
  return t.length >= 5 ? t.slice(0, 5) : t;
}

export default function TeacherSchedulePage() {
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [viewing, setViewing] = useState<ClassSchedule | null>(null);

  const teachersQuery = useQuery({
    queryKey: ["teachers"],
    queryFn: teacherApi.list,
  });
  const scheduleQuery = useSchedulesByTeacher(teacherId);

  const teachers = useMemo(() => {
    const list = teachersQuery.data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (t) =>
        `${t.firstName} ${t.lastName}`.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q),
    );
  }, [teachersQuery.data, query]);

  const selectedTeacher = teachersQuery.data?.find(
    (t) => t.teacherId === teacherId,
  );
  const schedules = scheduleQuery.data ?? [];

  return (
    <div>
      <PageHeader
        title="Teacher schedule"
        description="View a teacher's weekly teaching calendar."
      />

      <div className="mb-6 grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="rounded-lg border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Select teacher</span>
          </div>
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search teacher..."
              className="pl-8"
            />
          </div>
          <Select
            value={teacherId ? String(teacherId) : ""}
            onValueChange={(v) => setTeacherId(Number(v))}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  teachersQuery.isLoading ? "Loading..." : "Choose a teacher"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((t) => (
                <SelectItem key={t.teacherId} value={String(t.teacherId)}>
                  {t.firstName} {t.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedTeacher && (
            <div className="mt-4 space-y-1 rounded-md border bg-muted/30 p-3 text-sm">
              <div className="font-semibold">
                {selectedTeacher.firstName} {selectedTeacher.lastName}
              </div>
              <div className="text-xs text-muted-foreground">
                {selectedTeacher.email}
              </div>
              <div className="text-xs text-muted-foreground">
                {selectedTeacher.qualification}
              </div>
              <div className="pt-2 text-xs">
                <Badge variant="secondary">
                  {schedules.length} scheduled classes
                </Badge>
              </div>
            </div>
          )}
        </div>

        <div>
          {!teacherId ? (
            <div className="flex h-64 items-center justify-center rounded-lg border bg-card text-sm text-muted-foreground">
              Select a teacher to view their schedule.
            </div>
          ) : scheduleQuery.isLoading ? (
            <Skeleton className="h-[500px] w-full" />
          ) : scheduleQuery.isError ? (
            <ErrorState onRetry={() => scheduleQuery.refetch()} />
          ) : (
            <Tabs defaultValue="week">
              <TabsList>
                <TabsTrigger value="week">
                  <CalendarDays className="mr-2 h-4 w-4" /> Weekly
                </TabsTrigger>
                <TabsTrigger value="table">
                  <TableIcon className="mr-2 h-4 w-4" /> Table
                </TabsTrigger>
              </TabsList>
              <TabsContent value="week" className="mt-4">
                <WeeklyScheduleGrid
                  schedules={schedules}
                  onSelect={(s) => setViewing(s)}
                />
              </TabsContent>
              <TabsContent value="table" className="mt-4">
                <div className="rounded-lg border bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>Start</TableHead>
                        <TableHead>End</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Classroom</TableHead>
                        <TableHead>Semester</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedules.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="py-10 text-center text-sm text-muted-foreground"
                          >
                            No classes scheduled.
                          </TableCell>
                        </TableRow>
                      ) : (
                        schedules.map((s) => (
                          <TableRow
                            key={s.scheduleId}
                            className="cursor-pointer"
                            onClick={() => setViewing(s)}
                          >
                            <TableCell>
                              <Badge variant="secondary">
                                {DAY_LABELS[s.dayOfWeek]}
                              </Badge>
                            </TableCell>
                            <TableCell>{fmtTime(s.startTime)}</TableCell>
                            <TableCell>{fmtTime(s.endTime)}</TableCell>
                            <TableCell className="font-medium">
                              {s.subjectName ?? `#${s.subjectId}`}
                            </TableCell>
                            <TableCell>
                              {s.classroomName ?? `#${s.classroomId}`}
                            </TableCell>
                            <TableCell>{s.semester ?? "—"}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      <ScheduleViewDrawer
        open={!!viewing}
        onOpenChange={(v) => !v && setViewing(null)}
        schedule={viewing}
      />
    </div>
  );
}
