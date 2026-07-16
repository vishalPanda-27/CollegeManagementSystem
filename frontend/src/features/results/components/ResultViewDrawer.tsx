import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { GradeBadge, StatusBadge } from "./ResultBadges";
import type { Result } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: Result | null;
}

function fmt(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? v : d.toLocaleString();
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

export function ResultViewDrawer({ open, onOpenChange, result }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Result details</SheetTitle>
          <SheetDescription>Full examination result record.</SheetDescription>
        </SheetHeader>
        {result && (
          <div className="mt-6 space-y-1">
            <Row label="Result ID" value={`#${result.resultId}`} />
            <Row
              label="Student"
              value={`${result.studentName} (#${result.studentId})`}
            />
            <Row
              label="Subject"
              value={`${result.subjectName} (#${result.subjectId})`}
            />
            <Row label="Marks obtained" value={result.marksObtained} />
            <Row label="Maximum marks" value={result.maximumMarks} />
            <Row
              label="Percentage"
              value={`${result.percentage?.toFixed(2) ?? "—"}%`}
            />
            <Row label="Grade" value={<GradeBadge grade={result.grade} />} />
            <Row label="Status" value={<StatusBadge status={result.status} />} />
            <Row label="Created at" value={fmt(result.createdAt)} />
            <Row label="Updated at" value={fmt(result.updatedAt)} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
