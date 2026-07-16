import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AttendanceStatusBadge } from "./AttendanceStatusBadge";
import type { Attendance } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attendance: Attendance | null;
}

function fmt(v?: string | null) {
  if (!v) return "—";
  try {
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) return d.toLocaleString();
  } catch {
    // ignore
  }
  return v;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b py-2 last:border-0">
      <span className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </span>
      <span className="text-sm text-right">{value ?? "—"}</span>
    </div>
  );
}

export function AttendanceViewDrawer({ open, onOpenChange, attendance }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Attendance details</SheetTitle>
          <SheetDescription>
            Full attendance record information.
          </SheetDescription>
        </SheetHeader>
        {attendance && (
          <div className="mt-6 space-y-1">
            <Row label="ID" value={`#${attendance.attendanceId}`} />
            <Row
              label="Student"
              value={`${attendance.studentName} (#${attendance.studentId})`}
            />
            <Row
              label="Subject"
              value={`${attendance.subjectName} (#${attendance.subjectId})`}
            />
            <Row
              label="Teacher"
              value={
                attendance.teacherName
                  ? `${attendance.teacherName} (#${attendance.markedById})`
                  : "—"
              }
            />
            <Row label="Date" value={attendance.attendanceDate} />
            <Row
              label="Status"
              value={<AttendanceStatusBadge status={attendance.status} />}
            />
            <Row label="Created at" value={fmt(attendance.createdAt)} />
            <Row label="Updated at" value={fmt(attendance.updatedAt)} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
