import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import {
  Building2,
  Calendar,
  BookOpen,
  Hash,
  Layers,
  GraduationCap,
  Library,
} from "lucide-react";
import type { Subject } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: Subject | null;
}

function fmt(v?: string | null) {
  if (!v) return "—";
  try {
    return new Date(v).toLocaleString();
  } catch {
    return v;
  }
}

export function SubjectViewDrawer({ open, onOpenChange, subject }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Library className="h-5 w-5 text-primary" />
            {subject?.subjectName ?? "Subject"}
          </SheetTitle>
          <SheetDescription>
            Detailed information about this subject.
          </SheetDescription>
        </SheetHeader>

        {subject && (
          <div className="mt-6 space-y-6 px-4 pb-8 sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="font-mono">
                {subject.subjectCode}
              </Badge>
              <Badge variant="outline">
                <GraduationCap className="mr-1 h-3 w-3" />
                {subject.credits} credits
              </Badge>
              <Badge variant="outline">
                <Layers className="mr-1 h-3 w-3" />
                Semester {subject.semester}
              </Badge>
              <Badge variant={subject.active ? "default" : "secondary"}>
                {subject.active ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-card p-3">
                <div className="text-xs text-muted-foreground">
                  Theory hours
                </div>
                <div className="mt-1 text-lg font-semibold">
                  {subject.theoryHours ?? 0}
                </div>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="text-xs text-muted-foreground">
                  Practical hours
                </div>
                <div className="mt-1 text-lg font-semibold">
                  {subject.practicalHours ?? 0}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Department
              </h4>
              <div className="flex items-center justify-between rounded-lg border bg-card p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {subject.departmentName ?? "—"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ID: {subject.departmentId}
                    </div>
                  </div>
                </div>
                <Link
                  to={`/departments/${subject.departmentId}`}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  View
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Course
              </h4>
              <div className="flex items-center justify-between rounded-lg border bg-card p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {subject.courseName ?? "—"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ID: {subject.courseId}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Hash className="h-3.5 w-3.5" /> Subject ID
                </dt>
                <dd className="mt-1 font-mono">{subject.id}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Hash className="h-3.5 w-3.5" /> Code
                </dt>
                <dd className="mt-1 font-mono">{subject.subjectCode}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> Created
                </dt>
                <dd className="mt-1">{fmt(subject.createdAt)}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> Last updated
                </dt>
                <dd className="mt-1">{fmt(subject.updatedAt)}</dd>
              </div>
            </dl>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
