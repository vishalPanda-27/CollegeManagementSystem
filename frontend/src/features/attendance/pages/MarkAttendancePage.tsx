import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { AttendanceFormDialog } from "../components/AttendanceFormDialog";
import { useCreateAttendance } from "../hooks/useAttendance";

export default function MarkAttendancePage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const createMut = useCreateAttendance(() => {
    setOpen(false);
    navigate("/attendance");
  });

  return (
    <div>
      <PageHeader
        title="Mark attendance"
        description="Record a single attendance entry for a student."
        actions={
          <Button variant="outline" onClick={() => navigate("/attendance/bulk")}>
            <ListChecks className="mr-2 h-4 w-4" /> Switch to bulk mode
          </Button>
        }
      />

      <div className="rounded-lg border bg-card p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ClipboardCheck className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Mark student attendance</h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          Choose the student, subject, date, and status. The teacher who marked
          attendance can be recorded optionally.
        </p>
        <Button className="mt-4" onClick={() => setOpen(true)}>
          <ClipboardCheck className="mr-2 h-4 w-4" /> Open attendance form
        </Button>
      </div>

      <AttendanceFormDialog
        open={open}
        onOpenChange={setOpen}
        editing={null}
        submitting={createMut.isPending}
        onSubmit={(payload) => createMut.mutate(payload)}
      />
    </div>
  );
}
