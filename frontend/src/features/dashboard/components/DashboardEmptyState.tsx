import { Inbox } from "lucide-react";

export function DashboardEmptyState({
  message = "No data available",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
      <Inbox className="h-8 w-8 opacity-60" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
