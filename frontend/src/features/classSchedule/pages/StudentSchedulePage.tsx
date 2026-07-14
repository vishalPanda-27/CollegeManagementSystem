import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, Search, Info } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { studentApi } from "@/features/student/api/studentApi";
import { WeeklyScheduleGrid } from "../components/WeeklyScheduleGrid";
import { ScheduleViewDrawer } from "../components/ScheduleViewDrawer";
import type { ClassSchedule } from "../types";

export default function StudentSchedulePage() {
  const [studentId, setStudentId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [viewing, setViewing] = useState<ClassSchedule | null>(null);

  const studentsQuery = useQuery({
    queryKey: ["students"],
    queryFn: studentApi.list,
  });

  // Backend does not yet expose GET /api/v1/schedules/student/{id};
  // when it does, swap this in and the calendar renders automatically.
  const schedules: ClassSchedule[] = [];

  const students = useMemo(() => {
    const list = studentsQuery.data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (s) =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
        s.rollNumber.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q),
    );
  }, [studentsQuery.data, query]);

  const selected = studentsQuery.data?.find((s) => s.id === studentId);

  return (
    <div>
      <PageHeader
        title="Student schedule"
        description="View a student's weekly class timetable."
      />

      <div className="mb-6 grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="rounded-lg border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Select student</span>
          </div>
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or roll no..."
              className="pl-8"
            />
          </div>
          <Select
            value={studentId ? String(studentId) : ""}
            onValueChange={(v) => setStudentId(Number(v))}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  studentsQuery.isLoading ? "Loading..." : "Choose a student"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {students.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.rollNumber} · {s.firstName} {s.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selected && (
            <div className="mt-4 space-y-1 rounded-md border bg-muted/30 p-3 text-sm">
              <div className="font-semibold">
                {selected.firstName} {selected.lastName}
              </div>
              <div className="text-xs text-muted-foreground">
                Roll: {selected.rollNumber}
              </div>
              <div className="text-xs text-muted-foreground">
                {selected.departmentName ?? "—"}
              </div>
              <div className="pt-2">
                <Badge variant="secondary">{selected.status}</Badge>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              The backend does not yet expose a student schedule endpoint. This
              page will populate automatically once{" "}
              <code>GET /api/v1/schedules/student/{"{studentId}"}</code> is
              available.
            </span>
          </div>

          {!studentId ? (
            <div className="flex h-64 items-center justify-center rounded-lg border bg-card text-sm text-muted-foreground">
              Select a student to view their timetable.
            </div>
          ) : (
            <WeeklyScheduleGrid
              schedules={schedules}
              onSelect={(s) => setViewing(s)}
            />
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
