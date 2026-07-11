import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
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
  Building2,
  Calendar,
  Hash,
  Mail,
  Phone,
  GraduationCap,
  UserCircle,
  BookOpen,
  Library,
  IndianRupee,
  Users,
} from "lucide-react";
import { usersApi } from "@/api/users";
import { subjectApi } from "@/features/subject/api/subjectApi";
import { courseApi } from "@/features/course/api/courseApi";
import type { Teacher } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: Teacher | null;
}

function fmtDate(v?: string | null) {
  if (!v) return "—";
  try {
    return new Date(v).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return v;
  }
}
function fmt(v?: string | null) {
  if (!v) return "—";
  try {
    return new Date(v).toLocaleString();
  } catch {
    return v;
  }
}
function fmtMoney(v?: number | null) {
  if (v == null) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(v);
  } catch {
    return String(v);
  }
}

export function TeacherViewDrawer({ open, onOpenChange, teacher }: Props) {
  const userQuery = useQuery({
    queryKey: ["users", teacher?.userId],
    queryFn: () => usersApi.get(teacher!.userId!),
    enabled: open && !!teacher?.userId,
  });
  const subjectsQuery = useQuery({
    queryKey: ["subjects"],
    queryFn: subjectApi.list,
    enabled: open && !!teacher?.subjectIds?.length,
  });
  const coursesQuery = useQuery({
    queryKey: ["courses"],
    queryFn: courseApi.list,
    enabled: open && !!teacher?.courseIds?.length,
  });

  const subjectMap = new Map(subjectsQuery.data?.map((s) => [s.id, s]) ?? []);
  const courseMap = new Map(coursesQuery.data?.map((c) => [c.id, c]) ?? []);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-primary" />
            {teacher ? `${teacher.firstName} ${teacher.lastName}` : "Teacher"}
          </SheetTitle>
          <SheetDescription>Detailed teacher profile.</SheetDescription>
        </SheetHeader>

        {teacher && (
          <div className="mt-6 space-y-6 px-4 pb-8 sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="font-mono">
                #{teacher.teacherId}
              </Badge>
              <Badge variant={teacher.active ? "default" : "secondary"}>
                {teacher.active ? "Active" : "Inactive"}
              </Badge>
              <Badge variant="outline">
                <GraduationCap className="mr-1 h-3 w-3" />
                {teacher.qualification}
              </Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border bg-card p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" /> Email
                </div>
                <div className="mt-1 truncate text-sm font-medium">
                  {teacher.email}
                </div>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" /> Phone
                </div>
                <div className="mt-1 text-sm font-medium">{teacher.phone}</div>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <IndianRupee className="h-3.5 w-3.5" /> Salary
                </div>
                <div className="mt-1 text-sm font-medium">
                  {fmtMoney(teacher.salary)}
                </div>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> Joined
                </div>
                <div className="mt-1 text-sm font-medium">
                  {fmtDate(teacher.joiningDate)}
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-3">
              <div className="text-xs text-muted-foreground">Specialization</div>
              <div className="mt-1 text-sm font-medium">
                {teacher.specialization}
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
                      {teacher.departmentName ?? "—"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ID: {teacher.departmentId}
                    </div>
                  </div>
                </div>
                <Link
                  to={`/departments/${teacher.departmentId}`}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  View
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                User account
              </h4>
              <div className="rounded-lg border bg-card p-3">
                {teacher.userId ? (
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {userQuery.data?.username ?? `User #${teacher.userId}`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {userQuery.data?.email ?? `ID: ${teacher.userId}`}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No user account linked.
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Library className="h-3.5 w-3.5" /> Subjects (
                {teacher.subjectIds?.length ?? 0})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {teacher.subjectIds?.length ? (
                  teacher.subjectIds.map((id) => {
                    const s = subjectMap.get(id);
                    return (
                      <Badge key={id} variant="outline">
                        {s ? `${s.subjectName} (${s.subjectCode})` : `#${id}`}
                      </Badge>
                    );
                  })
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No subjects assigned.
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" /> Courses (
                {teacher.courseIds?.length ?? 0})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {teacher.courseIds?.length ? (
                  teacher.courseIds.map((id) => {
                    const c = courseMap.get(id);
                    return (
                      <Badge key={id} variant="outline">
                        {c ? `${c.courseName} (${c.courseCode})` : `#${id}`}
                      </Badge>
                    );
                  })
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No courses assigned.
                  </span>
                )}
              </div>
            </div>

            <Separator />

            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Hash className="h-3.5 w-3.5" /> Teacher ID
                </dt>
                <dd className="mt-1 font-mono">{teacher.teacherId}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> Created
                </dt>
                <dd className="mt-1">{fmt(teacher.createdAt)}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> Last updated
                </dt>
                <dd className="mt-1">{fmt(teacher.updatedAt)}</dd>
              </div>
            </dl>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
