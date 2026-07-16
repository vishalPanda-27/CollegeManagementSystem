import { Badge } from "@/components/ui/badge";
import {
  ATTENDANCE_STATUS_LABEL,
  type AttendanceStatus,
} from "../types";
import { cn } from "@/lib/utils";

const TONE: Record<AttendanceStatus, string> = {
  PRESENT:
    "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  ABSENT:
    "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
  LATE: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
  LEAVE:
    "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400",
};

export function AttendanceStatusBadge({
  status,
  className,
}: {
  status: AttendanceStatus;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", TONE[status], className)}
    >
      {ATTENDANCE_STATUS_LABEL[status]}
    </Badge>
  );
}
