import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ENROLLMENT_STATUS_LABEL,
  type Enrollment,
  type EnrollmentStatus,
} from "../types";

interface Props {
  enrollment: Enrollment | null;
  onOpenChange: (open: boolean) => void;
}

const statusVariant: Record<
  EnrollmentStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  ENROLLED: "default",
  COMPLETED: "outline",
  DROPPED: "destructive",
  WITHDRAWN: "secondary",
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

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium">{value ?? "—"}</span>
    </div>
  );
}

export function EnrollmentViewDrawer({ enrollment, onOpenChange }: Props) {
  return (
    <Sheet open={!!enrollment} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        {enrollment && (
          <>
            <SheetHeader>
              <SheetTitle>Enrollment #{enrollment.enrollmentId}</SheetTitle>
              <SheetDescription>
                {enrollment.studentName} · {enrollment.courseName}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Student" value={enrollment.studentName} />
                <Field label="Course" value={enrollment.courseName} />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <Field label="Semester" value={enrollment.semester} />
                <Field label="Academic year" value={enrollment.academicYear} />
                <Field
                  label="Enrollment date"
                  value={formatDate(enrollment.enrollmentDate)}
                />
                <Field
                  label="Grade"
                  value={
                    enrollment.grade != null ? enrollment.grade.toFixed(2) : "—"
                  }
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Status"
                  value={
                    <Badge variant={statusVariant[enrollment.status]}>
                      {ENROLLMENT_STATUS_LABEL[enrollment.status]}
                    </Badge>
                  }
                />
                <Field
                  label="Enrollment ID"
                  value={
                    <span className="font-mono text-xs">
                      {enrollment.enrollmentId}
                    </span>
                  }
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Created"
                  value={formatDate(enrollment.createdAt)}
                />
                <Field
                  label="Updated"
                  value={formatDate(enrollment.updatedAt)}
                />
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
