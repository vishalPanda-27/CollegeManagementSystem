import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ResultStatus } from "../types";

export function StatusBadge({ status }: { status: ResultStatus }) {
  const cls =
    status === "PASS"
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
      : "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30";
  return (
    <Badge variant="outline" className={cn("font-semibold", cls)}>
      {status}
    </Badge>
  );
}

export function GradeBadge({ grade }: { grade: string }) {
  const map: Record<string, string> = {
    "A+": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    A: "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30",
    B: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
    C: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-500 border-yellow-500/30",
    D: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30",
    F: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
  };
  const cls = map[grade] ?? "bg-muted text-foreground";
  return (
    <Badge variant="outline" className={cn("font-semibold", cls)}>
      {grade || "—"}
    </Badge>
  );
}
