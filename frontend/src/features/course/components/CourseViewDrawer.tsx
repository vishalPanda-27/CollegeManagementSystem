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
} from "lucide-react";
import type { Course } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null;
}

function fmt(v?: string | null) {
  if (!v) return "—";
  try {
    return new Date(v).toLocaleString();
  } catch {
    return v;
  }
}

export function CourseViewDrawer({ open, onOpenChange, course }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {course?.courseName ?? "Course"}
          </SheetTitle>
          <SheetDescription>
            Detailed information about this course.
          </SheetDescription>
        </SheetHeader>

        {course && (
          <div className="mt-6 space-y-6 px-4 pb-8 sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="font-mono">
                {course.courseCode}
              </Badge>
              <Badge variant="outline">
                <GraduationCap className="mr-1 h-3 w-3" />
                {course.credits} credits
              </Badge>
              <Badge variant="outline">
                <Layers className="mr-1 h-3 w-3" />
                Semester {course.semester}
              </Badge>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Description
              </h4>
              <p className="mt-2 text-sm leading-relaxed">
                {course.description?.trim() || "No description provided."}
              </p>
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
                      {course.departmentName ?? "—"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ID: {course.departmentId}
                    </div>
                  </div>
                </div>
                <Link
                  to={`/departments/${course.departmentId}`}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  View
                </Link>
              </div>
            </div>

            <Separator />

            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Hash className="h-3.5 w-3.5" /> Course ID
                </dt>
                <dd className="mt-1 font-mono">{course.id}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Hash className="h-3.5 w-3.5" /> Code
                </dt>
                <dd className="mt-1 font-mono">{course.courseCode}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> Created
                </dt>
                <dd className="mt-1">{fmt(course.createdAt)}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> Last updated
                </dt>
                <dd className="mt-1">{fmt(course.updatedAt)}</dd>
              </div>
            </dl>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
