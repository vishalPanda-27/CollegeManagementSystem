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
  DoorOpen,
  Hash,
  Layers,
  Users,
} from "lucide-react";
import {
  ROOM_STATUS_LABELS,
  ROOM_TYPE_LABELS,
  type Classroom,
  type RoomStatus,
} from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroom: Classroom | null;
}

function fmt(v?: string | null) {
  if (!v) return "—";
  try {
    return new Date(v).toLocaleString();
  } catch {
    return v;
  }
}

const statusVariant: Record<RoomStatus, "default" | "secondary" | "destructive"> = {
  AVAILABLE: "default",
  OCCUPIED: "secondary",
  MAINTENANCE: "destructive",
};

export function ClassroomViewDrawer({ open, onOpenChange, classroom }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <DoorOpen className="h-5 w-5 text-primary" />
            {classroom?.roomNumber ?? "Classroom"}
          </SheetTitle>
          <SheetDescription>
            Detailed information about this classroom.
          </SheetDescription>
        </SheetHeader>

        {classroom && (
          <div className="mt-6 space-y-6 px-4 pb-8 sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="font-mono">
                {classroom.roomNumber}
              </Badge>
              <Badge variant="outline">
                {ROOM_TYPE_LABELS[classroom.roomType]}
              </Badge>
              <Badge variant={statusVariant[classroom.status]}>
                {ROOM_STATUS_LABELS[classroom.status]}
              </Badge>
              <Badge variant="outline">
                <Users className="mr-1 h-3 w-3" />
                {classroom.capacity} seats
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-card p-3">
                <div className="text-xs text-muted-foreground">Building</div>
                <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {classroom.buildingName}
                </div>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="text-xs text-muted-foreground">Floor</div>
                <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  {classroom.floor ?? "—"}
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
                      {classroom.departmentName ?? "Unassigned"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {classroom.departmentId
                        ? `ID: ${classroom.departmentId}`
                        : "No department linked"}
                    </div>
                  </div>
                </div>
                {classroom.departmentId && (
                  <Link
                    to={`/departments/${classroom.departmentId}`}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    View
                  </Link>
                )}
              </div>
            </div>

            <Separator />

            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Hash className="h-3.5 w-3.5" /> Classroom ID
                </dt>
                <dd className="mt-1 font-mono">{classroom.id}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Hash className="h-3.5 w-3.5" /> Room number
                </dt>
                <dd className="mt-1 font-mono">{classroom.roomNumber}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> Created
                </dt>
                <dd className="mt-1">{fmt(classroom.createdAt)}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> Last updated
                </dt>
                <dd className="mt-1">{fmt(classroom.updatedAt)}</dd>
              </div>
            </dl>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
