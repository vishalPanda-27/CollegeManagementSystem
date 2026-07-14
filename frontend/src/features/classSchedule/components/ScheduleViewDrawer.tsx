import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { DAY_LABELS, type ClassSchedule } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  schedule: ClassSchedule | null;
}

function fmtTime(t?: string) {
  if (!t) return "—";
  return t.length >= 5 ? t.slice(0, 5) : t;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b py-2.5 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium">{value ?? "—"}</span>
    </div>
  );
}

export function ScheduleViewDrawer({ open, onOpenChange, schedule }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Class schedule</SheetTitle>
          <SheetDescription>Full details of this schedule.</SheetDescription>
        </SheetHeader>

        {schedule && (
          <div className="mt-4">
            <Row label="Schedule ID" value={<code>{schedule.scheduleId}</code>} />
            <Row
              label="Day"
              value={
                <Badge variant="secondary">
                  {DAY_LABELS[schedule.dayOfWeek]}
                </Badge>
              }
            />
            <Row
              label="Time"
              value={`${fmtTime(schedule.startTime)} – ${fmtTime(schedule.endTime)}`}
            />
            <Row
              label="Teacher"
              value={schedule.teacherName ?? `#${schedule.teacherId}`}
            />
            <Row
              label="Subject"
              value={schedule.subjectName ?? `#${schedule.subjectId}`}
            />
            <Row
              label="Classroom"
              value={schedule.classroomName ?? `#${schedule.classroomId}`}
            />
            <Row label="Semester" value={schedule.semester ?? "—"} />
            <Row label="Academic Year" value={schedule.academicYear ?? "—"} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
