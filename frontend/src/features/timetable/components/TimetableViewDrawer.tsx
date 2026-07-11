import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { DAY_LABELS, type Timetable } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  timetable: Timetable | null;
}

function fmtTime(t?: string) {
  if (!t) return "—";
  return t.length >= 5 ? t.slice(0, 5) : t;
}

function fmtDate(v?: string | null) {
  if (!v) return "—";
  try {
    return new Date(v).toLocaleString();
  } catch {
    return String(v);
  }
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b py-2.5 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium">{value ?? "—"}</span>
    </div>
  );
}

export function TimetableViewDrawer({ open, onOpenChange, timetable }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Timetable entry</SheetTitle>
          <SheetDescription>
            Full details of this scheduled class.
          </SheetDescription>
        </SheetHeader>

        {timetable && (
          <div className="mt-4">
            <Row label="ID" value={<code>{timetable.timetableId}</code>} />
            <Row
              label="Day"
              value={
                <Badge variant="secondary">
                  {DAY_LABELS[timetable.dayOfWeek]}
                </Badge>
              }
            />
            <Row
              label="Time"
              value={`${fmtTime(timetable.startTime)} – ${fmtTime(
                timetable.endTime,
              )}`}
            />
            <Row
              label="Course"
              value={timetable.courseName ?? `#${timetable.courseId}`}
            />
            <Row
              label="Subject"
              value={timetable.subjectName ?? `#${timetable.subjectId}`}
            />
            <Row
              label="Teacher"
              value={timetable.teacherName ?? `#${timetable.teacherId}`}
            />
            <Row
              label="Classroom"
              value={timetable.classroomName ?? `#${timetable.classroomId}`}
            />
            <Row label="Created" value={fmtDate(timetable.createdAt)} />
            <Row label="Updated" value={fmtDate(timetable.updatedAt)} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
