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
  UserCircle,
  MapPin,
  Cake,
  Venus,
} from "lucide-react";
import { STUDENT_STATUS_LABEL, type Student, type StudentStatus } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
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

const statusVariant: Record<StudentStatus, "default" | "secondary" | "outline" | "destructive"> = {
  ACTIVE: "default",
  INACTIVE: "secondary",
  GRADUATED: "outline",
  SUSPENDED: "destructive",
};

export function StudentViewDrawer({ open, onOpenChange, student }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-primary" />
            {student ? `${student.firstName} ${student.lastName}` : "Student"}
          </SheetTitle>
          <SheetDescription>Detailed student profile.</SheetDescription>
        </SheetHeader>

        {student && (
          <div className="mt-6 space-y-6 px-4 pb-8 sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="font-mono">
                #{student.id}
              </Badge>
              <Badge variant="outline" className="font-mono">
                {student.rollNumber}
              </Badge>
              <Badge variant={statusVariant[student.status]}>
                {STUDENT_STATUS_LABEL[student.status]}
              </Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border bg-card p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" /> Email
                </div>
                <div className="mt-1 truncate text-sm font-medium">
                  {student.email}
                </div>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" /> Phone
                </div>
                <div className="mt-1 text-sm font-medium">
                  {student.phoneNumber}
                </div>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Cake className="h-3.5 w-3.5" /> Date of birth
                </div>
                <div className="mt-1 text-sm font-medium">
                  {fmtDate(student.dateOfBirth)}
                </div>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Venus className="h-3.5 w-3.5" /> Gender
                </div>
                <div className="mt-1 text-sm font-medium capitalize">
                  {student.gender?.toLowerCase() || "—"}
                </div>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> Admission date
                </div>
                <div className="mt-1 text-sm font-medium">
                  {fmtDate(student.admissionDate)}
                </div>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> Address
                </div>
                <div className="mt-1 text-sm font-medium">
                  {student.address || "—"}
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
                      {student.departmentName ?? "—"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ID: {student.departmentId}
                    </div>
                  </div>
                </div>
                <Link
                  to={`/departments/${student.departmentId}`}
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
                  <Hash className="h-3.5 w-3.5" /> Student ID
                </dt>
                <dd className="mt-1 font-mono">{student.id}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Hash className="h-3.5 w-3.5" /> Roll number
                </dt>
                <dd className="mt-1 font-mono">{student.rollNumber}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> Created
                </dt>
                <dd className="mt-1">{fmt(student.createdAt)}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> Last updated
                </dt>
                <dd className="mt-1">{fmt(student.updatedAt)}</dd>
              </div>
            </dl>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
